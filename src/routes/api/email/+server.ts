import type { RequestHandler } from './$types';
import nodemailer from 'nodemailer';

export const POST: RequestHandler = async ({ request }) => {
	const { email, password, message } = await request.json();

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: email,
			pass: password
		}
	});

	const mailOptions = {
		from: 'ESP32 eFrame',
		to: 'tkcshnr@gmail.com',
		subject: 'Daily report',
		text: message
	};

	try {
		await transporter.sendMail(mailOptions);
		return new Response();
	} catch (error: any) {
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
