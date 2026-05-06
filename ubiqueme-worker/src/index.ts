import { SignJWT, importPKCS8 } from 'jose';

interface Env {
	FIREBASE_PROJECT_ID: string;
	FIREBASE_CLIENT_EMAIL: string;
	FIREBASE_PRIVATE_KEY: string;
	RESEND_API_KEY: string;
}

const CORS_HEADERS = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default {
	async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
		// Handle CORS preflight
		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: CORS_HEADERS });
		}

		if (request.method !== 'POST') {
			return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
				status: 405, 
				headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } 
			});
		}

		// MUST DO: CONFIGURAR RUTA DEL WORKER EN CLOUDFLARE PARA PRODUCCION
		// Actualmente responde en la ruta por defecto de workers.dev, mapearlo a api.ubiqueme.com despues.

		/* =================================================================================================
		 * SECURITY REQUIREMENT:
		 * THIS ENDPOINT CURRENTLY ACCEPTS scannerEmail DIRECTLY FROM THE REQUEST BODY.
		 * IN A PRODUCTION ENVIRONMENT, THIS IS VULNERABLE TO SPOOFING.
		 * YOU MUST IMPLEMENT FIREBASE JWT VALIDATION.
		 * THE FRONTEND SHOULD SEND THE FIREBASE ID TOKEN IN THE AUTHORIZATION HEADER.
		 * THE WORKER MUST DECODE AND VERIFY THIS JWT TO EXTRACT THE REAL EMAIL INSTEAD OF TRUSTING THE BODY.
		 * ================================================================================================= */

		try {
			const body: any = await request.json();
			const { qrId, message, scannerEmail } = body;

			if (!qrId || !message || !scannerEmail) {
				return new Response(JSON.stringify({ error: 'Missing parameters' }), { 
					status: 400, 
					headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } 
				});
			}

			console.log(`[Worker] 🚀 Fetch API recibido para QR: ${qrId} | De: ${scannerEmail}`);

			const accessToken = await getGoogleAccessToken(env);

			// 1. Get QR data
			const qrData = await getFirestoreQR(env.FIREBASE_PROJECT_ID, accessToken, qrId);
			if (!qrData || !qrData.uid) {
				return new Response(JSON.stringify({ error: 'QR not found' }), { 
					status: 404, 
					headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } 
				});
			}

			// 2. Get Owner data
			const ownerData = await getFirestoreUser(env.FIREBASE_PROJECT_ID, accessToken, qrData.uid);
			if (!ownerData || !ownerData.email) {
				return new Response(JSON.stringify({ error: 'Owner not found' }), { 
					status: 404, 
					headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } 
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
`
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
					headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } 
				});
			}

			return new Response(JSON.stringify({ success: true }), { 
				status: 200, 
				headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } 
			});

		} catch (e: any) {
			console.error('Error procesando peticion HTTP:', e);
			return new Response(JSON.stringify({ error: 'Internal server error', details: e.message }), { 
				status: 500, 
				headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } 
			});
		}
	},
};

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
