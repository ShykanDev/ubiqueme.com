import { SignJWT, importPKCS8 } from 'jose';

// Interfaz unificada para todas tus variables de entorno
interface Env {
	FIREBASE_PROJECT_ID: string;
	FIREBASE_CLIENT_EMAIL: string;
	FIREBASE_PRIVATE_KEY: string;
	RESEND_API_KEY: string;
}

export default {
	/**
	 * MANEJADOR DE EMAIL: El Relevo de Privacidad (Privacy Relay)
	 * Cuando alguien escribe a soporte@ubiqueme.com con ID:[UID]
	 */
	async email(message: any, env: Env, ctx: ExecutionContext): Promise<void> {
		const subject = message.headers.get('subject') || '';
		const sender = message.from; // El correo del que escaneó el QR
		console.log(`[Worker] 📧 Email recibido de: ${sender} | Asunto: ${subject}`);

		// Buscamos el ID del QR en el asunto del correo
		const qrIdMatch = subject.match(/ID:\[(.*?)\]/);

		if (qrIdMatch && qrIdMatch[1]) {
			const qrId = qrIdMatch[1].trim();
			console.log(`[Worker] 🔍 QR ID Extraído: ${qrId}`);

			try {
				const accessToken = await getGoogleAccessToken(env);

				// 1. Buscamos el QR para saber de quién es
				const qrData = await getFirestoreQR(env.FIREBASE_PROJECT_ID, accessToken, qrId);
				console.log(`[Worker] 📦 Datos del QR obtenidos:`, qrData);

				if (qrData && qrData.uid) {
					// 2. Buscamos quién es el dueño real en Firestore
					const ownerData = await getFirestoreUser(env.FIREBASE_PROJECT_ID, accessToken, qrData.uid);
					console.log(`[Worker] 👤 Datos del dueño obtenidos:`, ownerData);

					if (ownerData && ownerData.email) {
					console.log(`[Worker] 🚀 Preparando envío de correo vía Resend a: ${ownerData.email}`);
					// 2. Preparamos el email con diseño Premium AMOLED
					const emailPayload = {
						from: 'Ubiqueme Security <soporte@ubiqueme.com>',
						to: ownerData.email,
						subject: `🚨 Aviso de Escaneo: ${ownerData.displayName || 'Usuario'}`,
						html: `
              <div style="background-color: #09090b; color: #ffffff; font-family: sans-serif; padding: 40px; border-radius: 20px; max-width: 600px; margin: auto; border: 1px solid #27272a;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <div style="display: inline-block; background: #f97316; color: #000; padding: 10px 20px; border-radius: 10px; font-weight: 900; letter-spacing: 2px; font-size: 14px;">
                    UBIQUEME PROTOCOL
                  </div>
                </div>

                <h2 style="color: #ffffff; font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 10px;">Hola, ${ownerData.displayName || 'propietario'}</h2>
                <p style="color: #a1a1aa; text-align: center; font-size: 16px; margin-bottom: 30px;">
                  Se ha detectado una actividad de contacto en uno de sus dispositivos protegidos.
                </p>

                <div style="background-color: #18181b; padding: 25px; border-radius: 15px; border: 1px solid #3f3f46; margin-bottom: 30px;">
                  <p style="margin: 0 0 15px 0;"><strong style="color: #f97316; text-transform: uppercase; font-size: 11px; tracking: 1px;">Remitente:</strong><br /><span style="color: #fff; font-size: 15px;">${sender}</span></p>
                  <p style="margin: 0 0 15px 0;"><strong style="color: #f97316; text-transform: uppercase; font-size: 11px; tracking: 1px;">Referencia:</strong><br /><span style="color: #fff; font-size: 15px;">${subject}</span></p>
                  <p style="margin: 0;"><strong style="color: #f97316; text-transform: uppercase; font-size: 11px; tracking: 1px;">Mensaje Segregado:</strong><br />
                    <span style="color: #e4e4e7; font-style: italic; font-size: 14px;">"Se ha recibido un mensaje a través de nuestro servidor de relevo de privacidad."</span>
                  </p>
                </div>

                <div style="background-color: #451a03; border-left: 4px solid #f97316; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                  <p style="color: #fdba74; font-size: 13px; margin: 0; line-height: 1.6;">
                    <strong>🛡️ Aviso de Seguridad:</strong> Sus datos están protegidos con nosotros. Hasta este momento, su información personal permanece privada y segura.
                    Si usted decide contactar por su cuenta al usuario remitente, usted asume los riesgos e implicaciones que esto significa.
                    Cualquier respuesta directa es bajo su total responsabilidad.
                  </p>
                </div>

                <div style="text-align: center; font-size: 11px; color: #52525b; line-height: 1.5;">
                  Este es un mensaje automático generado por el núcleo de seguridad de Ubiqueme.<br />
                  Por favor, no responda directamente a este correo.<br />
                  &copy; 2024 Ubiqueme Smart Tags.
                </div>
              </div>
            `,
					};

					// 3. Enviamos el correo al dueño vía Resend
					const res = await fetch('https://api.resend.com/emails', {
						method: 'POST',
						headers: {
							Authorization: `Bearer ${env.RESEND_API_KEY}`,
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(emailPayload),
					});

					const resData: any = await res.json();
					console.log('Resultado Resend:', resData);
				}
				}
			} catch (e) {
				console.error('Error en Privacy Relay:', e);
			}
		} else {
			// Fallback: Si no tiene el formato ID:[], reenviar a tu backup
			await message.forward('alejandrocarbajal@prasadam.mx');
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
