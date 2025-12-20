'use server'

import { Resend } from 'resend'
import { z } from 'zod'

// Simple HTML escape for email content
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

const SendReceiptInput = z.object({
  orderId: z.string(),
  receiptDataUrl: z.string(),
  orderDetailsHtml: z.string(),
  userEmail: z.string().email(),
  siteUrl: z.string().url(),
})

type SendReceiptInput = z.infer<typeof SendReceiptInput>

const sendEmailToCustomerInput = z.object({
  userEmail: z.string().email(),
  orderId: z.string(),
})

export async function sendReceiptEmail(input: SendReceiptInput) {
  const { orderId, receiptDataUrl, orderDetailsHtml, userEmail, siteUrl } =
    SendReceiptInput.parse(input)

  const resendApiKey = process.env.RESEND_API_KEY
  const adminEmail = process.env.ADMIN_EMAIL || 'ezcentials@gmail.com'
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'EZCENTIALS <onboarding@resend.dev>';


  if (!resendApiKey || !adminEmail) {
    const errorMsg =
      'Email server is not configured. Missing RESEND_API_KEY or ADMIN_EMAIL in .env file.'
    console.warn(`sendReceiptEmail Warning: ${errorMsg}`)
    // Return success to avoid blocking the user flow, but log the issue.
    return { success: true, error: errorMsg }
  }

  const resend = new Resend(resendApiKey)
  const encodedUserEmail = Buffer.from(userEmail).toString('base64');


  // These URLs point to pages within the Next.js app
  const confirmUrl = `${siteUrl}/order-status/customer-confirm?orderId=${orderId}&userEmail=${encodedUserEmail}`;
  const rejectUrl = `${siteUrl}/order-status/customer-reject?orderId=${orderId}&userEmail=${encodedUserEmail}`;

  const base64Content = receiptDataUrl.split(',')[1]
  if (!base64Content) {
    const errorMsg = 'Invalid receipt data URI: Base64 content not found.'
    console.error(`sendReceiptEmail Error: ${errorMsg}`)
    return { success: false, error: errorMsg }
  }

  try {
    console.log(
      `Attempting to send email to ${adminEmail} for order ${orderId}...`
    )
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [adminEmail],
      subject: `Nouveau reçu pour la commande ${orderId}`,
      html: `
        <h1>Nouveau reçu de paiement pour la commande ${escapeHtml(orderId)}</h1>
        <p><strong>Email du client:</strong> ${escapeHtml(userEmail)}</p>

        <h2>Détails de la commande:</h2>
        ${orderDetailsHtml}

        <p>Le reçu est attaché à cet e-mail.</p>

        <hr>

        <h2>Actions de la commande :</h2>
        <p>Veuillez confirmer ou rejeter cette commande. Le client sera notifié par e-mail.</p>
        <table width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <table cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" width="200" height="40" bgcolor="#28a745" style="border-radius: 5px; color: #ffffff; display: block;">
                    <a href="${escapeHtml(confirmUrl)}" target="_blank" style="font-size: 16px; font-weight: bold; font-family: sans-serif; text-decoration: none; line-height: 40px; width: 100%; display: inline-block;">
                      <span style="color: #ffffff;">Confirmer la commande</span>
                    </a>
                  </td>
                  <td width="20"></td>
                  <td align="center" width="200" height="40" bgcolor="#dc3545" style="border-radius: 5px; color: #ffffff; display: block;">
                     <a href="${escapeHtml(rejectUrl)}" target="_blank" style="font-size: 16px; font-weight: bold; font-family: sans-serif; text-decoration: none; line-height: 40px; width: 100%; display: inline-block;">
                      <span style="color: #ffffff;">Rejeter la commande</span>
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <p style="font-size: 12px; color: #666;">Si les boutons ne fonctionnent pas, copiez-collez les liens suivants :<br>
           Confirmer : ${escapeHtml(confirmUrl)}<br>
           Rejeter : ${escapeHtml(rejectUrl)}
        </p>
      `,
      attachments: [
        {
          filename: `recu-${orderId}.jpg`,
          content: base64Content,
        },
      ],
    })

    if (error) {
      console.error('Resend API Error:', error)
      return {
        success: false,
        error: error.message || 'Failed to send receipt email via Resend.',
      }
    }

    console.log(
      `Email sent successfully for order ${orderId}. Resend ID: ${data?.id}`
    )
    return { success: true, error: null }
  } catch (error: any) {
    console.error('Catastrophic failure in sendReceiptEmail:', error)
    return {
      success: false,
      error: error.message || 'A critical error occurred while sending the email.',
    }
  }
}

export async function sendCustomerConfirmationEmail(
  input: z.infer<typeof sendEmailToCustomerInput>
) {
  const { userEmail, orderId } = sendEmailToCustomerInput.parse(input)
  const resendApiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'EZCENTIALS <onboarding@resend.dev>';


  if (!resendApiKey) {
    console.error('Email server is not configured.')
    return { success: false, error: 'Email server is not configured.' }
  }

  const resend = new Resend(resendApiKey)

  try {
    await resend.emails.send({
      from: fromEmail,
      to: userEmail,
      subject: `Votre commande EZCENTIALS #${orderId} est confirmée !`,
      html: `
                <h1>Votre commande a été validée !</h1>
                <p>Bonjour,</p>
                <p>Bonne nouvelle ! Votre commande <strong>#${orderId}</strong> a été validée par notre équipe.</p>
                <p>Elle sera préparée et expédiée dans les plus brefs délais. Vous pouvez consulter le statut mis à jour dans votre historique de commandes.</p>
                <p>Merci pour votre confiance.</p>
                <br>
                <p>Cordialement,</p>
                <p>L'équipe EZCENTIALS</p>
            `,
    })
    return { success: true, error: null }
  } catch (error: any) {
    console.error('Failed to send confirmation email to customer:', error)
    return {
      success: false,
      error: error.message || 'Failed to send confirmation email.',
    }
  }
}

export async function sendCustomerRejectionEmail(
  input: z.infer<typeof sendEmailToCustomerInput>
) {
  const { userEmail, orderId } = sendEmailToCustomerInput.parse(input)
  const resendApiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'EZCENTIALS <onboarding@resend.dev>';


  if (!resendApiKey) {
    console.error('Email server is not configured.')
    return { success: false, error: 'Email server is not configured.' }
  }

  const resend = new Resend(resendApiKey)

  try {
    await resend.emails.send({
      from: fromEmail,
      to: userEmail,
      subject: `Information concernant votre commande EZCENTIALS #${orderId}`,
      html: `
                <h1>Un problème est survenu avec votre commande</h1>
                <p>Bonjour,</p>
                <p>Nous vous contactons concernant votre commande <strong>#${orderId}</strong>.</p>
                <p>Malheureusement, nous n'avons pas pu valider votre paiement et votre commande a été rejetée. Vous pouvez consulter le statut mis à jour dans votre historique de commandes.</p>
                <p>Nous vous invitons à contacter notre support client à <a href="mailto:contact-support@ezcentials.com">contact-support@ezcentials.com</a> pour plus d'informations ou pour tenter de finaliser votre commande à nouveau.</p>
                <p>Nous nous excusons pour ce désagrément.</p>
                <br>
                <p>Cordialement,</p>
                <p>L'équipe EZCENTIALS</p>
            `,
    })
    return { success: true, error: null }
  } catch (error: any) {
    console.error('Failed to send rejection email to customer:', error)
    return {
      success: false,
      error: error.message || 'Failed to send rejection email.',
    }
  }
}
