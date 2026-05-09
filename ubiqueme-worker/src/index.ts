import { SignJWT, importPKCS8 } from 'jose';

interface Env {
	FIREBASE_PROJECT_ID: string;
	FIREBASE_CLIENT_EMAIL: string;
	FIREBASE_PRIVATE_KEY: string;
	RESEND_API_KEY: string;
	WHATSAPP_PHONE_NUMBER_ID: string;
	WHATSAPP_VERIFY_TOKEN: string;
	WHATSAPP_ACCESS_TOKEN: string;
}

const CORS_HEADERS = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default {
	async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		const cleanPath = url.pathname.replace(/\/$/, '');
		
		// LOG DE EMERGENCIA: Capturar CUALQUIER intento de conexión
		console.log(`[TRAFICO] ${request.method} ${request.url} | IP: ${request.headers.get('cf-connecting-ip')} | UA: ${request.headers.get('user-agent')}`);

		console.log(`[Worker] Petición: ${request.method} ${cleanPath} | Agent: ${request.headers.get('user-agent')}`);

		// Handle CORS preflight
		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: CORS_HEADERS });
		}

		// Verificación de Webhook (Solo para Meta / GET)
		if (request.method === 'GET' && cleanPath === '/api/whatsapp') {
			return handleMetaVerification(request, env);
		}

		if (request.method !== 'POST') {
			return new Response(JSON.stringify({ error: 'Method not allowed' }), {
				status: 405,
				headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
			});
		}

		// Enrutador
		if (cleanPath === '/api/whatsapp') {
			return await handleWhatsAppWebhook(request, env);
		}

		// Fallback a la notificación por correo (Para el botón "Enviar Anónimo por Correo")
		return await handleEmailNotification(request, env);
	},
};

/**
 * Verificación obligatoria para WhatsApp Cloud API (Meta)
 */
function handleMetaVerification(request: Request, env: Env): Response {
	const url = new URL(request.url);
	const mode = url.searchParams.get('hub.mode');
	const token = url.searchParams.get('hub.verify_token');
	const challenge = url.searchParams.get('hub.challenge');

	if (mode === 'subscribe' && token === env.WHATSAPP_VERIFY_TOKEN) {
		console.log('[Worker] Webhook de Meta verificado con éxito.');
		return new Response(challenge, { status: 200 });
	}

	return new Response('Verification failed', { status: 403 });
}

/**
 * Endpoint para Webhook de WhatsApp (Soporta Twilio y Meta)
 */
async function handleWhatsAppWebhook(request: Request, env: Env): Promise<Response> {
	try {
		const contentType = request.headers.get('content-type') || '';
		let bodyText = '';
		let senderPhone = '';

		// 1. Detectar si es Meta (JSON) o Twilio (Form)
		if (contentType.includes('application/json')) {
			const json: any = await request.json();
			console.log('[DEBUG] Payload de Meta:', JSON.stringify(json, null, 2));
			// Estructura de Meta Cloud API
			const message = json.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
			if (!message) return new Response('No message found', { status: 200 });

			bodyText = message.text?.body || '';
			senderPhone = `whatsapp:${message.from}`;
		} else {
			// Estructura de Twilio
			const formData = await request.formData();
			bodyText = formData.get('Body') as string;
			senderPhone = formData.get('From') as string;
		}

		if (!bodyText || !senderPhone) {
			return new Response('Missing data', { status: 200 });
		}

		console.log(`[Worker] 🚀 WhatsApp recibido de ${senderPhone}: ${bodyText.substring(0, 20)}...`);

		// Extraer el ID del QR usando Regex (Busca "ID: ABC123")
		const idMatch = bodyText.match(/ID:\s*([A-Za-z0-9_-]+)/i);
		if (!idMatch || !idMatch[1]) {
			console.log('[Worker] No se encontró un ID de QR en el mensaje.');
			return new Response('OK', { status: 200 });
		}
		const qrId = idMatch[1];
		console.log(`[Worker] QR ID detectado: ${qrId}`);

		// Extraer el mensaje adicional usando Regex
		const msgMatch = bodyText.match(/Mensaje:\s*([\s\S]*)/i);
		const customMessage = msgMatch && msgMatch[1] ? msgMatch[1].trim() : 'Sin mensaje adicional.';

		console.log('[Worker] Obteniendo token de Google...');
		const accessToken = await getGoogleAccessToken(env);

		// 1. Obtener datos del QR
		console.log(`[Worker] Buscando QR ${qrId} en Firestore...`);
		const qrData = await getFirestoreQR(env.FIREBASE_PROJECT_ID, accessToken, qrId);
		if (!qrData || !qrData.uid) {
			const errorMsg = `[Worker] ERROR: QR ${qrId} no encontrado en Firestore.`;
			console.log(errorMsg);
			return new Response(errorMsg, { status: 200 });
		}
		console.log(`[Worker] QR encontrado. UID del dueño: ${qrData.uid}`);

		// 2. Obtener datos del dueño
		console.log(`[Worker] Buscando datos del dueño ${qrData.uid}...`);
		const ownerData = await getFirestoreUser(env.FIREBASE_PROJECT_ID, accessToken, qrData.uid);
		if (!ownerData || !ownerData.phone) {
			const errorMsg = `[Worker] ERROR: El dueño ${qrData.uid} no existe o no tiene teléfono.`;
			console.log(errorMsg);
			return new Response(errorMsg, { status: 200 });
		}
		console.log(`[Worker] Dueño encontrado: ${ownerData.displayName}. Teléfono: ${ownerData.phone}`);

		let ownerWhatsApp = ownerData.phone;
		if (!ownerWhatsApp.startsWith('+')) ownerWhatsApp = `+${ownerWhatsApp}`;
		if (!ownerWhatsApp.startsWith('whatsapp:')) ownerWhatsApp = `whatsapp:${ownerWhatsApp}`;

		const scannerCleanPhone = senderPhone.replace('whatsapp:', '');

		// 3. Preparar Mensaje para el Dueño
		const notificationText = `*Aviso de ubiqueme.com*\n\nHola ${ownerData.displayName || 'propietario'},\n\nEl número *${scannerCleanPhone}* escaneó su código QR *${qrData.name || 'Desconocido'}* y dejó este mensaje:\n\n_"${customMessage}"_\n\n⚠️ _Interacción segura. Actúe con cuidado si responde._`;

		// 4. Enviar vía Meta Cloud API
		const url = `https://graph.facebook.com/v20.0/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
		const payload = {
			messaging_product: 'whatsapp',
			recipient_type: 'individual',
			to: ownerWhatsApp.replace('whatsapp:', '').replace('+', ''),
			type: 'text',
			text: { preview_url: false, body: notificationText },
		};

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		});

		const result: any = await response.json();

		if (!response.ok) {
			const metaError = result.error?.message || JSON.stringify(result);
			const errorMsg = `[Worker] ERROR de Meta: ${metaError}`;
			console.error(errorMsg);
			return new Response(errorMsg, { status: 200 });
		}

		return new Response(`[Worker] ÉXITO: Notificación enviada al dueño (${ownerData.displayName}) al número ${ownerWhatsApp}`, { status: 200 });
	} catch (e: any) {
		console.error('Error procesando Webhook:', e);
		return new Response('Error', { status: 200 });
	}
}

/**
 * Función para enviar mensajes usando Meta Cloud API
 */
async function sendMetaWhatsApp(env: Env, to: string, text: string): Promise<boolean> {
	// Limpiar el número (quitar 'whatsapp:' y '+')
	const cleanNumber = to.replace('whatsapp:', '').replace('+', '');

	const url = `https://graph.facebook.com/v20.0/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

	const payload = {
		messaging_product: 'whatsapp',
		recipient_type: 'individual',
		to: cleanNumber,
		type: 'text',
		text: { preview_url: false, body: text },
	};

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		});

		const result: any = await response.json();

		if (!response.ok) {
			const metaError = result.error?.message || JSON.stringify(result);
			console.error('[Meta API Error]', metaError);
			return false; // El error detallado lo manejaremos arriba
		}

		console.log('[Worker] Mensaje enviado con éxito vía Meta.');
		return true;
	} catch (error: any) {
		console.error('[Meta API Fetch Error]', error);
		return false;
	}
}

/**
 * Endpoint Original de Notificación por Correo (Resend)
 */
async function handleEmailNotification(request: Request, env: Env): Promise<Response> {
	try {
		const body: any = await request.json();
		const { qrId, message, scannerEmail } = body;

		if (!qrId || !message || !scannerEmail) {
			return new Response(JSON.stringify({ error: 'Missing parameters' }), {
				status: 400,
				headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
			});
		}

		console.log(`[Worker]  Fetch API recibido para QR: ${qrId} | De: ${scannerEmail}`);

		const accessToken = await getGoogleAccessToken(env);

		// 1. Get QR data
		const qrData = await getFirestoreQR(env.FIREBASE_PROJECT_ID, accessToken, qrId);
		if (!qrData || !qrData.uid) {
			return new Response(JSON.stringify({ error: 'QR not found' }), {
				status: 404,
				headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
			});
		}

		// 2. Get Owner data
		const ownerData = await getFirestoreUser(env.FIREBASE_PROJECT_ID, accessToken, qrData.uid);
		if (!ownerData || !ownerData.email) {
			return new Response(JSON.stringify({ error: 'Owner not found' }), {
				status: 404,
				headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
			});
		}

		// Format message for HTML safety
		const safeMessage = message.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');

		// 3. Prepare Resend Payload
		const emailPayload = {
			from: 'ubiqueme.com <soporte@ubiqueme.com>',
			to: ownerData.email,
			subject: `Aviso de Escaneo: ${qrData.name || 'QR'}`,
			html: `
<!DOCTYPE html>
<html lang="es" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Aviso de Escaneo</title>
  <style>
    :root {
      color-scheme: dark;
      supported-color-schemes: dark;
    }
    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      background-color: #000000 !important;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #000000 !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #000000;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #0a0a0a; border: 1px solid #222222; border-radius: 8px;">
          <tr>
            <td style="padding: 32px;">

              <div style="font-size: 14px; font-weight: 600; letter-spacing: -0.02em; color: #ededed; margin-bottom: 32px;">
                ubiqueme.com
              </div>

              <div style="font-size: 15px; line-height: 1.6; color: #a1a1aa;">
                <div style="color: #ededed; font-size: 18px; font-weight: 500; margin-bottom: 24px; letter-spacing: -0.01em;">
                  Hola <span style="color: #ededed; font-weight: 500;">${ownerData.displayName || 'propietario'}</span>,
                </div>

                <p style="margin: 0 0 16px 0;">
                  Alguien escaneó su código QR <span style="color: #ededed; font-weight: 500;">${qrData.name || 'Desconocido'}</span> y le ha dejado el siguiente mensaje:
                </p>

                <div style="background-color: #111111; border: 1px solid #222222; border-radius: 6px; padding: 20px; margin: 24px 0; color: #ededed; font-size: 14px; word-break: break-word;">
					${safeMessage}
				</div>

                <div style="font-size: 13px; color: #71717a; margin-top: 32px; padding-top: 24px; border-top: 1px solid #222222; line-height: 1.5;">
                  <p style="margin: 0 0 16px 0;">
                    Este mensaje fue enviado por el visitante: <strong style="color: #ededed; user-select: all;">${scannerEmail}</strong>
                  </p>
                  <p style="margin: 0 0 16px 0;">
                    Por su seguridad y privacidad, hemos deshabilitado las respuestas automáticas. Si usted decide ponerse en contacto con esta persona para recuperar su objeto, <strong>deberá copiar el correo manualmente</strong> y escribirle bajo su propia responsabilidad. Al hacerlo, usted acepta que ubiqueme.com no es responsable de las interacciones fuera de esta plataforma.
                  </p>
                  <p style="margin: 0;">
                    Para cualquier duda contáctenos en ayuda@ubiqueme.com
                  </p>
                </div>
              </div>

            </td>
          </tr>
        </table>
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px;">
          <tr>
            <td align="center" style="padding-top: 24px; font-size: 12px; color: #52525b;">
              &copy; ${new Date().getFullYear()} ubiqueme.com derechos reservados.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`,
		};

		// 4. Send via Resend
		const res = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${env.RESEND_API_KEY}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(emailPayload),
		});

		const responseText = await res.text();

		if (!res.ok) {
			console.error(`[Worker] Resend Error: ${responseText}`);
			return new Response(JSON.stringify({ error: 'Failed to send email' }), {
				status: 500,
				headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
			});
		}

		return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
		});
	} catch (e: any) {
		console.error('Error procesando peticion HTTP:', e);
		return new Response(JSON.stringify({ error: 'Internal server error', details: e.message }), {
			status: 500,
			headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
		});
	}
}

/**
 * Helpers Root (Firebase)
 */
async function getGoogleAccessToken(env: Env) {
	const privateKey = await importPKCS8(env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), 'RS256');
	const jwt = await new SignJWT({
		iss: env.FIREBASE_CLIENT_EMAIL,
		sub: env.FIREBASE_CLIENT_EMAIL,
		aud: 'https://oauth2.googleapis.com/token',
		scope: 'https://www.googleapis.com/auth/datastore',
	})
		.setProtectedHeader({ alg: 'RS256' })
		.setIssuedAt()
		.setExpirationTime('1h')
		.sign(privateKey);

	const res = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
	});

	const data: any = await res.json();
	if (!data.access_token) throw new Error('No admin token');
	return data.access_token;
}

async function getFirestoreUser(projectId: string, token: string, uid: string) {
	const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${uid}`;
	const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
	if (res.status === 404) return null;
	const data: any = await res.json();
	const fields = data.fields || {};
	return {
		email: fields.email?.stringValue,
		displayName: fields.displayName?.stringValue || fields.name?.stringValue,
		phone: fields.phone?.stringValue, // <-- Añadido para sacar el teléfono
	};
}

async function getFirestoreQR(projectId: string, token: string, qrId: string) {
	const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/publicQR/${qrId}`;
	const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
	if (res.status === 404) return null;
	const data: any = await res.json();
	const fields = data.fields || {};
	return {
		uid: fields.uid?.stringValue,
		name: fields.name?.stringValue,
	};
}
