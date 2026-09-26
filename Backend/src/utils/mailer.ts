import logger from './logger';

export interface QueryMailPayload {
  type?: 'enquiry' | 'service' | 'feedback';
  name: string;
  email?: string | null;
  phone: string;
  alternatePhone?: string;
  address?: string;
  city?: string;
  monthlyElectricityBill?: number;
  solarCapacityInterested?: string;
  message?: string;

  // Feedback specific fields
  rating?: number;
  feedbackType?: string;

  // Service ticket specific fields
  serviceCategory?: string;
  productCategory?: string;
  productSubcategory?: string;
  capacity?: string;
  issueType?: string;
  quantity?: number;
  serialNumber?: string;
  purchaseDate?: string;
  invoiceFileName?: string;
  invoiceFileDataUrl?: string;
  serialFileName?: string;
  serialFileDataUrl?: string;
}

export async function sendQueryEmail(payload: QueryMailPayload): Promise<boolean> {
  const mailTo = process.env.CLIENT_NOTIFICATION_EMAIL || 'owner@yourdomain.com';
  const mailFrom = process.env.MAIL_FROM_ADDRESS || 'leads@yourdomain.com';

  const formType = payload.type || (payload.message?.includes('[FEEDBACK SUBMISSION]') ? 'feedback' : payload.message?.includes('[TICKET SUBMITTED') ? 'service' : 'enquiry');

  let subjectAdmin = '';
  let subjectCustomer = '';
  let adminHtmlContent = '';
  let customerHtmlContent = '';

  const commonCss = `
    body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f1f5f9; color: #1e293b; margin: 0; padding: 24px; }
    .email-card { max-width: 620px; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; margin: 0 auto; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
    .brand-header { background-color: #0f172a; padding: 24px 30px; border-bottom: 4px solid #eab308; }
    .brand-name { color: #ffffff; font-size: 20px; font-weight: 800; letter-spacing: 0.5px; }
    .brand-tagline { color: #eab308; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px; }
    .content-body { padding: 28px 30px; }
    .section-title { font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; }
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .info-table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; vertical-align: top; }
    .info-table td.label { font-weight: 700; color: #64748b; width: 38%; background-color: #f8fafc; }
    .info-table td.value { color: #0f172a; width: 62%; font-weight: 500; }
    .quote-box { background-color: #f8fafc; border-left: 4px solid #eab308; padding: 16px; border-radius: 6px; font-size: 13px; line-height: 1.6; color: #334155; margin-top: 10px; }
    .star-rating { color: #d97706; font-size: 16px; font-weight: bold; }
    .footer { background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 30px; text-align: center; font-size: 11px; color: #64748b; }
  `;

  // Render Star string for Feedback
  const renderStars = (rating: number = 5) => {
    const fullStar = '★';
    const emptyStar = '☆';
    return `${fullStar.repeat(rating)}${emptyStar.repeat(5 - rating)} (${rating}/5 Stars)`;
  };

  // Helper to format interactive file attachments in HTML
  const formatAttachmentCell = (fileName?: string, fileDataUrl?: string) => {
    if (!fileName) return '<span style="color:#94a3b8;font-style:italic;">Not Uploaded</span>';
    
    if (fileDataUrl && fileDataUrl.startsWith('data:image/')) {
      return `
        <div style="margin-top: 6px;">
          <div style="font-weight: 600; color: #0f172a; font-size: 12px; margin-bottom: 6px;">✓ ${fileName}</div>
          <a href="${fileDataUrl}" target="_blank" download="${fileName}" style="display: inline-block;">
            <img src="${fileDataUrl}" alt="${fileName}" style="max-width: 320px; max-height: 240px; border-radius: 8px; border: 1px solid #cbd5e1; box-shadow: 0 4px 10px rgba(0,0,0,0.08); display: block;" />
          </a>
          <div style="margin-top: 8px;">
            <a href="${fileDataUrl}" target="_blank" download="${fileName}" style="display: inline-block; padding: 6px 14px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 11px; font-weight: bold; border-bottom: 2px solid #eab308;">
              View / Open Image (${fileName})
            </a>
          </div>
        </div>
      `;
    }

    if (fileDataUrl && fileDataUrl.startsWith('data:application/pdf')) {
      return `
        <div style="margin-top: 6px;">
          <div style="font-weight: 600; color: #0f172a; font-size: 12px; margin-bottom: 6px;">📄 ${fileName} (PDF Document)</div>
          <a href="${fileDataUrl}" target="_blank" download="${fileName}" style="display: inline-block; padding: 6px 14px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 11px; font-weight: bold; border-bottom: 2px solid #eab308;">
            View / Open PDF (${fileName})
          </a>
        </div>
      `;
    }

    return `<span>${fileName}</span>`;
  };

  // Construct email attachment objects for Resend API
  const attachments: Array<{ filename: string; content: string }> = [];

  if (payload.invoiceFileDataUrl && payload.invoiceFileDataUrl.includes('base64,')) {
    attachments.push({
      filename: payload.invoiceFileName || 'Invoice_Attachment.jpg',
      content: payload.invoiceFileDataUrl.split('base64,')[1],
    });
  }

  if (payload.serialFileDataUrl && payload.serialFileDataUrl.includes('base64,')) {
    attachments.push({
      filename: payload.serialFileName || 'Serial_Plate_Attachment.jpg',
      content: payload.serialFileDataUrl.split('base64,')[1],
    });
  }

  if (formType === 'feedback') {
    // -------------------------------------------------------------
    // TEMPLATE 1: CUSTOMER FEEDBACK & REVIEW RATING
    // -------------------------------------------------------------
    const ratingScore = payload.rating || 5;
    const category = payload.feedbackType || 'General Service Quality';
    const cleanComment = payload.message?.replace(/\[FEEDBACK SUBMISSION\][\s\S]*?Comments:\s*/i, '').trim() || 'No additional comments provided.';

    subjectAdmin = `Customer Feedback Received - ${payload.name} (${ratingScore}/5 Stars)`;
    subjectCustomer = `Thank You for Your Feedback - TNS Solar Energy Ltd`;

    adminHtmlContent = `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"><style>${commonCss}</style></head>
        <body>
          <div class="email-card">
            <div class="brand-header">
              <div class="brand-name">TNS Solar Energy Ltd</div>
              <div class="brand-tagline">Customer Experience Review</div>
            </div>
            <div class="content-body">
              <div class="section-title">New Customer Feedback Received</div>
              <p style="font-size: 13px; color: #475569; margin-bottom: 20px;">
                A customer has submitted feedback regarding their experience with TNS Solar Energy. Details below:
              </p>
              <table class="info-table">
                <tr><td class="label">Customer Name</td><td class="value">${payload.name}</td></tr>
                <tr><td class="label">Email Address</td><td class="value">${payload.email ? `<a href="mailto:${payload.email}">${payload.email}</a>` : 'Not Provided'}</td></tr>
                <tr><td class="label">Phone Number</td><td class="value"><a href="tel:${payload.phone}">${payload.phone}</a></td></tr>
                <tr><td class="label">City / Region</td><td class="value">${payload.city || 'Jaipur, Rajasthan'}</td></tr>
                <tr><td class="label">Feedback Category</td><td class="value">${category}</td></tr>
                <tr><td class="label">Rating Score</td><td class="value star-rating">${renderStars(ratingScore)}</td></tr>
              </table>
              <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-top: 16px;">Customer Comments:</div>
              <div class="quote-box">"${cleanComment}"</div>
            </div>
            <div class="footer">
              TNS Solar Energy Ltd &bull; Automated Feedback System
            </div>
          </div>
        </body>
      </html>
    `;

    customerHtmlContent = `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"><style>${commonCss}</style></head>
        <body>
          <div class="email-card">
            <div class="brand-header">
              <div class="brand-name">TNS Solar Energy Ltd</div>
              <div class="brand-tagline">Simplifying Solar</div>
            </div>
            <div class="content-body">
              <div class="section-title">Thank You for Your Feedback!</div>
              <p style="font-size: 14px; line-height: 1.6; color: #334155;">
                Dear <strong>${payload.name}</strong>,
              </p>
              <p style="font-size: 13px; line-height: 1.6; color: #334155;">
                Thank you for taking the time to share your feedback with us. Your review helps us continuously improve our solar panel installation quality and customer support standards.
              </p>
              <div class="quote-box">
                <strong>Your Rating:</strong> <span class="star-rating">${renderStars(ratingScore)}</span><br>
                <strong>Category:</strong> ${category}<br>
                <strong>Comments:</strong> "${cleanComment}"
              </div>
              <p style="font-size: 13px; line-height: 1.6; color: #334155; margin-top: 20px;">
                If you ever need assistance with your solar setup, our technical support team is always here to help.
              </p>
              <p style="font-size: 13px; color: #0f172a; font-weight: bold; margin-top: 24px;">
                Warm regards,<br>
                <span style="font-weight: normal; color: #64748b;">Customer Relations Team &bull; TNS Solar Energy Ltd</span>
              </p>
            </div>
            <div class="footer">
              TNS Solar Energy Ltd &bull; Vaishali Nagar, Jaipur, Rajasthan 302021
            </div>
          </div>
        </body>
      </html>
    `;
  } else if (formType === 'service') {
    // -------------------------------------------------------------
    // TEMPLATE 2: SERVICE TICKET & SUPPORT COMPLAINT
    // -------------------------------------------------------------
    const ticketCategory = payload.serviceCategory || 'Service Request / Fault Report';
    const cleanIssue = payload.message?.replace(/\[TICKET SUBMITTED[\s\S]*?Issue Description:\s*/i, '').trim() || payload.message || 'Details provided in ticket form.';

    subjectAdmin = `Support Ticket Alert: ${ticketCategory} - ${payload.name} (${payload.city || 'Jaipur'})`;
    subjectCustomer = `Service Ticket Confirmation - TNS Solar Energy Ltd`;

    adminHtmlContent = `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"><style>${commonCss}</style></head>
        <body>
          <div class="email-card">
            <div class="brand-header">
              <div class="brand-name">TNS Solar Energy Ltd</div>
              <div class="brand-tagline">Technical Support & Service Operations</div>
            </div>
            <div class="content-body">
              <div class="section-title">New Service Support Ticket Registered</div>
              <p style="font-size: 13px; color: #475569; margin-bottom: 20px;">
                A customer has logged a service request / technical complaint. Details and uploaded file attachments below:
              </p>
              <table class="info-table">
                <tr><td class="label">Customer Name</td><td class="value">${payload.name}</td></tr>
                <tr><td class="label">Email Address</td><td class="value">${payload.email ? `<a href="mailto:${payload.email}">${payload.email}</a>` : 'Not Provided'}</td></tr>
                <tr><td class="label">Primary Phone</td><td class="value"><a href="tel:${payload.phone}">${payload.phone}</a></td></tr>
                <tr><td class="label">Alternate Phone</td><td class="value">${payload.alternatePhone ? `<a href="tel:${payload.alternatePhone}">${payload.alternatePhone}</a>` : 'None'}</td></tr>
                <tr><td class="label">Installation Site Address</td><td class="value">${payload.address || 'Address provided in system'}</td></tr>
                <tr><td class="label">City / Region</td><td class="value">${payload.city || 'Jaipur'}</td></tr>
                <tr><td class="label">Service Category</td><td class="value">${ticketCategory}</td></tr>
                <tr><td class="label">Product Category</td><td class="value">${payload.productCategory || 'Solar PV Modules'}</td></tr>
                <tr><td class="label">Product Subcategory</td><td class="value">${payload.productSubcategory || 'Mono PERC'}</td></tr>
                <tr><td class="label">Solar System Capacity</td><td class="value">${payload.capacity || payload.solarCapacityInterested || '5 kW'}</td></tr>
                <tr><td class="label">Fault / Issue Type</td><td class="value" style="color: #dc2626; font-weight: bold;">${payload.issueType || 'Technical Inspection Needed'}</td></tr>
                <tr><td class="label">Serial Number</td><td class="value">${payload.serialNumber || 'N/A'}</td></tr>
                <tr><td class="label">Purchase Date</td><td class="value">${payload.purchaseDate || 'N/A'}</td></tr>
                <tr><td class="label">Invoice Copy File</td><td class="value">${formatAttachmentCell(payload.invoiceFileName, payload.invoiceFileDataUrl)}</td></tr>
                <tr><td class="label">Serial Plate File</td><td class="value">${formatAttachmentCell(payload.serialFileName, payload.serialFileDataUrl)}</td></tr>
              </table>
              <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-top: 16px;">Issue Description:</div>
              <div class="quote-box">"${cleanIssue}"</div>
            </div>
            <div class="footer">
              TNS Solar Energy Ltd &bull; Field Service Operations Division
            </div>
          </div>
        </body>
      </html>
    `;

    customerHtmlContent = `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"><style>${commonCss}</style></head>
        <body>
          <div class="email-card">
            <div class="brand-header">
              <div class="brand-name">TNS Solar Energy Ltd</div>
              <div class="brand-tagline">Technical Support Desk</div>
            </div>
            <div class="content-body">
              <div class="section-title">Service Ticket Received</div>
              <p style="font-size: 14px; line-height: 1.6; color: #334155;">
                Dear <strong>${payload.name}</strong>,
              </p>
              <p style="font-size: 13px; line-height: 1.6; color: #334155;">
                We have received your service ticket regarding <strong>${payload.issueType || 'your solar installation'}</strong>.
              </p>
              <div class="quote-box">
                <strong>Request Category:</strong> ${ticketCategory}<br>
                <strong>Reported Issue:</strong> ${payload.issueType || 'Technical Service Request'}<br>
                <strong>Status:</strong> Under Evaluation by Technical Engineering Team
              </div>
              <p style="font-size: 13px; line-height: 1.6; color: #334155; margin-top: 20px;">
                Our field service engineers will review your report and contact you at <strong>+91 ${payload.phone}</strong> within 24 hours to coordinate an inspection or resolve the issue.
              </p>
              <p style="font-size: 13px; color: #0f172a; font-weight: bold; margin-top: 24px;">
                Best regards,<br>
                <span style="font-weight: normal; color: #64748b;">Solar Engineering & Service Team &bull; TNS Solar Energy Ltd</span>
              </p>
            </div>
            <div class="footer">
              TNS Solar Energy Ltd &bull; Phone: +91 95093 80380
            </div>
          </div>
        </body>
      </html>
    `;
  } else {
    // -------------------------------------------------------------
    // TEMPLATE 3: GENERAL SOLAR ENQUIRY / SITE SURVEY REQUEST
    // -------------------------------------------------------------
    const capacityStr = payload.solarCapacityInterested || '3 kW - 5 kW System';
    const cleanMsg = payload.message?.replace(/\[GENERAL ENQUIRY\][\s\S]*?Requirements:\s*/i, '').trim() || payload.message || 'Interested in rooftop solar panel feasibility check.';

    subjectAdmin = `New Solar Lead: ${payload.name} (${payload.city || 'Jaipur'})`;
    subjectCustomer = `We Have Received Your Solar Enquiry - TNS Solar Energy Ltd`;

    adminHtmlContent = `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"><style>${commonCss}</style></head>
        <body>
          <div class="email-card">
            <div class="brand-header">
              <div class="brand-name">TNS Solar Energy Ltd</div>
              <div class="brand-tagline">New Lead & Site Survey Enquiry</div>
            </div>
            <div class="content-body">
              <div class="section-title">New Solar Lead Received</div>
              <p style="font-size: 13px; color: #475569; margin-bottom: 20px;">
                A new customer lead has been submitted on the portal. Customer details below:
              </p>
              <table class="info-table">
                <tr><td class="label">Customer Name</td><td class="value">${payload.name}</td></tr>
                <tr><td class="label">Email Address</td><td class="value">${payload.email ? `<a href="mailto:${payload.email}">${payload.email}</a>` : 'Not Provided'}</td></tr>
                <tr><td class="label">Phone Number</td><td class="value"><a href="tel:${payload.phone}">${payload.phone}</a></td></tr>
                <tr><td class="label">City / Region</td><td class="value">${payload.city || 'Jaipur, Rajasthan'}</td></tr>
                <tr><td class="label">Estimated Solar Capacity</td><td class="value">${capacityStr}</td></tr>
                ${payload.monthlyElectricityBill && payload.monthlyElectricityBill > 1 ? `<tr><td class="label">Monthly Bill</td><td class="value">₹${payload.monthlyElectricityBill.toLocaleString('en-IN')}</td></tr>` : ''}
                ${payload.address && !payload.address.includes('N/A') ? `<tr><td class="label">Site Address</td><td class="value">${payload.address}</td></tr>` : ''}
              </table>
              <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-top: 16px;">Customer Requirements / Message:</div>
              <div class="quote-box">"${cleanMsg}"</div>
            </div>
            <div class="footer">
              TNS Solar Energy Ltd &bull; Automated Solar Lead Engine
            </div>
          </div>
        </body>
      </html>
    `;

    customerHtmlContent = `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8"><style>${commonCss}</style></head>
        <body>
          <div class="email-card">
            <div class="brand-header">
              <div class="brand-name">TNS Solar Energy Ltd</div>
              <div class="brand-tagline">Simplifying Solar</div>
            </div>
            <div class="content-body">
              <div class="section-title">Request Received Successfully</div>
              <p style="font-size: 14px; line-height: 1.6; color: #334155;">
                Dear <strong>${payload.name}</strong>,
              </p>
              <p style="font-size: 13px; line-height: 1.6; color: #334155;">
                Thank you for reaching out to TNS Solar Energy Ltd. We have successfully received your inquiry regarding rooftop solar solutions.
              </p>
              <p style="font-size: 13px; line-height: 1.6; color: #334155;">
                Our solar engineering experts will perform a preliminary satellite rooftop check and contact you at <strong>+91 ${payload.phone}</strong> shortly to discuss your custom setup and government PM Surya Ghar subsidy options.
              </p>
              <p style="font-size: 13px; color: #0f172a; font-weight: bold; margin-top: 24px;">
                Warm regards,<br>
                <span style="font-weight: normal; color: #64748b;">Solar Engineering Advisory Team &bull; TNS Solar Energy Ltd</span>
              </p>
            </div>
            <div class="footer">
              TNS Solar Energy Ltd &bull; Vaishali Nagar, Jaipur, Rajasthan 302021
            </div>
          </div>
        </body>
      </html>
    `;
  }

  try {
    const hasSmtpConfig = process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_PASS !== 're_your_api_secret_key';
    if (!hasSmtpConfig) {
      logger.info('SMTP credentials are not configured or placeholder. Logging email instead:');
      logger.info(`TO (Admin): ${mailTo}`);
      logger.info(`FROM: ${mailFrom}`);
      logger.info(`SUBJECT: ${subjectAdmin}`);
      logger.info(`ATTACHMENTS COUNT: ${attachments.length}`);
      logger.info(`BODY:\n${adminHtmlContent}`);
      if (payload.email) {
        logger.info(`TO (Customer): ${payload.email}`);
        logger.info(`SUBJECT (Customer): ${subjectCustomer}`);
      }
      return true;
    }

    // 1. Send Admin Notification Email via Resend HTTP API
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
        subject: subjectAdmin,
        html: adminHtmlContent,
        ...(attachments.length > 0 && { attachments }),
      }),
    });

    if (!adminResponse.ok) {
      const errorText = await adminResponse.text();
      throw new Error(`Resend API (Admin Notification) failed: ${errorText}`);
    }
    logger.info(`Notification email successfully sent to client: ${mailTo}`);

    // 2. Send Automated Confirmation Email to Customer (if email is provided)
    if (payload.email) {
      const customerResponse = await globalThis.fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SMTP_PASS}`,
        },
        body: JSON.stringify({
          from: mailFrom,
          to: payload.email,
          subject: subjectCustomer,
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
    logger.error('Error sending query email via Resend API', { error: err.message });
    return false;
  }
}
