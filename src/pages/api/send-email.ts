import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
	try {
		const body = await request.json();
		const { nome, email, telefone, mensagem } = body;

		// Validação básica
		if (!nome || !email || !mensagem) {
			return new Response(
				JSON.stringify({ error: 'Campos obrigatórios faltando' }),
				{ status: 400 }
			);
		}

		// Enviar email
		const data = await resend.emails.send({
			from: 'Formulário Tauro <noreply@taurocomunicacoes.com.br>',
			to: ['tatiane@taurocomunicacoes.com.br'],
			replyTo: email,
			subject: `Novo Lead - ${nome}`,
			html: `
				<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
					<h2 style="color: #56C2F0;">Novo contato do site</h2>
					<div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
						<p><strong>Nome:</strong> ${nome}</p>
						<p><strong>Email:</strong> ${email}</p>
						<p><strong>Telefone:</strong> ${telefone || 'Não informado'}</p>
					</div>
					<div style="margin: 20px 0;">
						<strong>Mensagem:</strong>
						<p style="white-space: pre-wrap;">${mensagem}</p>
					</div>
					<hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
					<p style="color: #666; font-size: 12px;">
						Este email foi enviado através do formulário de contato do site Tauro Comunicações.
					</p>
				</div>
			`,
		});

		return new Response(JSON.stringify({ success: true, data }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Erro ao enviar email:', error);
		return new Response(
			JSON.stringify({ error: 'Erro ao enviar mensagem' }),
			{ status: 500 }
		);
	}
};
