import { transporter } from '../config/mail';
import logger from './logger';

interface QueryMailPayload {
  name: string;
  email?: string | null;
  phone: string;
  address: string;
  city: string;
  monthlyElectricityBill: number;
  solarCapacityInterested?: string;
  message?: string;
}

export async function sendQueryEmail(payload: QueryMailPayload): Promise<boolean> {
  const mailTo = process.env.CLIENT_NOTIFICATION_EMAIL || 'owner@yourdomain.com';
  const mailFrom = process.env.MAIL_FROM_ADDRESS || 'leads@yourdomain.com';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f7fafc; color: #2d3748; margin: 0; padding: 20px; }
          .container { max-width: 600px; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); padding: 30px; margin: 0 auto; border-top: 6px solid #eab308; }
          .logo { text-align: center; font-size: 24px; font-weight: bold; color: #1e3a8a; margin-bottom: 20px; }
          .headline { font-size: 20px; font-weight: bold; color: #1a202c; border-bottom: 2px solid #edf2f7; padding-bottom: 12px; margin-bottom: 20px; }
          .info-table { width: 100%; border-collapse: collapse; }
          .info-table td { padding: 10px 0; border-bottom: 1px solid #edf2f7; font-size: 14px; }
          .info-table td.label { font-weight: 600; color: #718096; width: 40%; }
          .info-table td.value { color: #2d3748; width: 60%; }
          .message-box { background: #f8fafc; border-left: 4px solid #cbd5e1; padding: 15px; margin-top: 15px; border-radius: 4px; font-style: italic; }
          .footer { font-size: 12px; text-align: center; color: #a0aec0; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">⚡ Solar Energy Portal</div>
          <div class="headline">New Customer Query Received</div>
          <p>Hi, You have received a new solar lead. Details below:</p>
          <table class="info-table">
            <tr>
              <td class="label">Customer Name</td>
              <td class="value">${payload.name}</td>
            </tr>
            <tr>
              <td class="label">Email Address</td>
              <td class="value">${payload.email ? `<a href="mailto:${payload.email}">${payload.email}</a>` : '<span style="color:#a0aec0;font-style:italic;">Not Provided</span>'}</td>
            </tr>
            <tr>
              <td class="label">Phone Number</td>
              <td class="value"><a href="tel:${payload.phone}">${payload.phone}</a></td>
            </tr>
            <tr>
              <td class="label">City / Region</td>
              <td class="value">${payload.city}</td>
            </tr>
            <tr>
              <td class="label">Site Address</td>
              <td class="value">${payload.address}</td>
            </tr>
            <tr>
              <td class="label">Monthly Electricity Bill</td>
              <td class="value">₹${payload.monthlyElectricityBill.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td class="label">Estimated Capacity</td>
              <td class="value">${payload.solarCapacityInterested || 'Not Specified'}</td>
            </tr>
          </table>
          ${payload.message ? `
            <p style="font-weight: 600; margin-top: 20px; color: #718096; font-size: 14px;">Customer Message:</p>
            <div class="message-box">"${payload.message}"</div>
          ` : ''}
          <div class="footer">
            This lead was generated automatically from the solar lead generation portal.
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const hasSmtpConfig = process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_PASS !== 're_your_api_secret_key';
    if (!hasSmtpConfig) {
      logger.info('SMTP credentials are not configured or placeholder. Logging email instead:');
      logger.info(`TO (Admin): ${mailTo}`);
      logger.info(`FROM: ${mailFrom}`);
      logger.info(`SUBJECT: 🔥 Alert: New Solar Lead - ${payload.name} (${payload.city})`);
      logger.info(`BODY:\n${htmlContent}`);
      if (payload.email) {
        logger.info(`TO (Customer): ${payload.email}`);
        logger.info('SUBJECT (Customer): We\'ve received your Solar request! - TNS Solars ⚡');
      }
      return true;
    }

    // 1. Send Lead notification email to Admin/Client via Resend HTTP API (Port 443)
    const adminResponse = await globalThis.fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SMTP_PASS}`,
      },
      body: JSON.stringify({
        from: mailFrom,
        to: mailTo,
        ...(payload.email && { replyTo: payload.email }),
        subject: `🔥 Alert: New Solar Lead - ${payload.name} (${payload.city})`,
        html: htmlContent,
      }),
    });

    if (!adminResponse.ok) {
      const errorText = await adminResponse.text();
      throw new Error(`Resend API (Admin Notification) failed: ${errorText}`);
    }
    logger.info(`Lead notification email successfully sent to client: ${mailTo}`);

    // 2. Send automated confirmation email to Customer (if email is provided)
    if (payload.email) {
      const customerHtmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f7fafc; color: #2d3748; margin: 0; padding: 20px; }
              .container { max-width: 600px; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); padding: 30px; margin: 0 auto; border-top: 6px solid #eab308; }
              .logo { text-align: center; font-size: 24px; font-weight: bold; color: #1e3a8a; margin-bottom: 20px; }
              .headline { font-size: 20px; font-weight: bold; color: #1a202c; border-bottom: 2px solid #edf2f7; padding-bottom: 12px; margin-bottom: 20px; }
              .content { font-size: 14px; line-height: 1.6; color: #2d3748; }
              .footer { font-size: 12px; text-align: center; color: #a0aec0; margin-top: 30px; border-top: 1px solid #edf2f7; padding-top: 15px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="logo">⚡ TNS Solars</div>
              <div class="headline">Request Received Successfully</div>
              <div class="content">
                <p>Dear <strong>${payload.name}</strong>,</p>
                <p>Thank you for reaching out to TNS Solars! We have successfully received your query.</p>
                <p>Our solar engineering experts will perform a preliminary satellite solar feasibility check for your site and contact you at <strong>+91 ${payload.phone}</strong> shortly to discuss your options.</p>
                <p>If you have any urgent questions, please feel free to reply directly to this email or call us.</p>
                <br>
                <p>Warm regards,</p>
                <p><strong>TNS Solars Support Team</strong></p>
              </div>
              <div class="footer">
                TNS Solars - Clean Energy for a Brighter Future.<br>
                This is an automated receipt confirmation for your request.
              </div>
            </div>
          </body>
        </html>
      `;

      const customerResponse = await globalThis.fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SMTP_PASS}`,
        },
        body: JSON.stringify({
          from: mailFrom,
          to: payload.email,
          subject: `We've received your Solar request! - TNS Solars ⚡`,
          html: customerHtmlContent,
        }),
      });

      if (!customerResponse.ok) {
        const errorText = await customerResponse.text();
        logger.error(`Resend API (Customer Confirmation) failed: ${errorText}`);
      } else {
        logger.info(`Confirmation email successfully sent to customer: ${payload.email}`);
      }
    }

    return true;
  } catch (err: any) {
    logger.error('Error sending lead query email via Resend API', { error: err.message });
    return false;
  }
}
