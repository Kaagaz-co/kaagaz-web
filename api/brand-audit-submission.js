// Vercel serverless function for brand audit form submission
// This function sends confirmation emails and stores submission data

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    
    // Validate required fields
    const required = ['name', 'phone', 'brandName', 'business', 'email', 'salesChannel'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        missing 
      });
    }

    // Format email content for user
    const userEmailData = {
      to: data.email,
      from: 'Kaagaz Studios <info@kaagaz.co>',
      subject: 'Thank you for registering for FREE brand Audit',
      html: generateUserConfirmationEmail(data),
      text: generateUserConfirmationText(data)
    };

    // Format email content for admin (info@kaagaz.co)
    const adminEmailData = {
      to: 'info@kaagaz.co',
      from: 'Brand Audit Form <info@kaagaz.co>',
      subject: `New Brand Audit Request - ${data.brandName}`,
      html: generateAdminNotificationEmail(data),
      text: generateAdminNotificationText(data)
    };

    // Send email using your preferred service
    // Option 1: Zoho Mail (SMTP)
    if (process.env.ZOHO_MAIL_USER && process.env.ZOHO_MAIL_PASSWORD) {
      await sendWithZoho(userEmailData);
      await sendWithZoho(adminEmailData);
    }
    // Option 2: SendGrid
    else if (process.env.SENDGRID_API_KEY) {
      await sendWithSendGrid(userEmailData);
      await sendWithSendGrid(adminEmailData);
    }
    // Option 3: Resend
    else if (process.env.RESEND_API_KEY) {
      await sendWithResend(userEmailData);
      await sendWithResend(adminEmailData);
    }
    // Option 4: Mailgun
    else if (process.env.MAILGUN_API_KEY) {
      await sendWithMailgun(userEmailData);
      await sendWithMailgun(adminEmailData);
    }
    // Fallback: Log to console (development)
    else {
      console.log('User email would be sent:', userEmailData);
      console.log('Admin email would be sent:', adminEmailData);
      console.log('Form submission:', data);
    }

    // Optional: Store submission in database or Google Sheets
    // await storeInDatabase(data);

    return res.status(200).json({ 
      success: true, 
      message: 'Form submitted successfully' 
    });

  } catch (error) {
    console.error('Error processing form:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

// User confirmation email template
function generateUserConfirmationEmail(data) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank you for registering for FREE brand Audit</title>
  <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree:wght@700;400&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Bai Jamjuree', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 40px auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { font-family: 'Bai Jamjuree', Arial, sans-serif; font-size: 40px; font-weight: 700; letter-spacing: 0.15em; color: #c21215; margin-bottom: 10px; text-transform: uppercase; }
    h1 { color: #333; font-size: 24px; margin-bottom: 20px; font-family: 'Bai Jamjuree', Arial, sans-serif; }
    .content { margin: 20px 0; }
    .highlight { background-color: #FEF2F2; border-left: 4px solid #DC2626; padding: 15px; margin: 20px 0; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 14px; font-family: 'Bai Jamjuree', Arial, sans-serif; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">KAAGAZ</div>
    </div>
    
    <h1>Hi ${data.name},</h1>
    
    <div class="content">
      <p>Thank you for registering for brand for <strong>FREE design audit</strong> by Kaagaz Studios.</p>
      
      <div class="highlight">
        <p style="margin: 0;">We have received your details and we are glad to let you know that your brand audit has been started.</p>
      </div>
      
      <p>Our team will reach out in case any further details are required.</p>
      
      <p>Once the audit is completed, our team will reach out with a detailed report.</p>
    </div>
    
    <div class="footer">
      <p><strong>Best Regards,</strong><br><br>Kaagaz Studios</p>
      <p style="margin-top: 20px;">
        <a href="mailto:info@kaagaz.co" style="color: #DC2626; text-decoration: none;">info@kaagaz.co</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

function generateUserConfirmationText(data) {
  return `
Hi ${data.name},

Thank you for registering for brand for FREE design audit by Kaagaz Studios.

We have received your details and we are glad to let you know that your brand audit has been started.

Our team will reach out in case any further details are required.

Once the audit is completed, our team will reach out with a detailed report.

Best Regards,

Kaagaz Studios
info@kaagaz.co
  `.trim();
}

function generateAdminNotificationEmail(data) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Brand Audit Request</title>
  <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree:wght@700;400&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Bai Jamjuree', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 40px auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background-color: #DC2626; color: white; padding: 20px; border-radius: 8px 8px 0 0; margin: -40px -40px 30px -40px; display: flex; align-items: center; justify-content: center; }
    .logo { font-family: 'Bai Jamjuree', Arial, sans-serif; font-size: 32px; font-weight: 700; letter-spacing: 0.15em; color: #fff; margin-right: 18px; text-transform: uppercase; }
    h1 { color: white; font-size: 24px; margin: 0; font-family: 'Bai Jamjuree', Arial, sans-serif; }
    .info-box { background-color: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 6px; padding: 20px; margin: 20px 0; }
    .info-row { display: flex; margin-bottom: 12px; }
    .info-label { font-weight: bold; min-width: 150px; color: #666; }
    .info-value { color: #333; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    td { padding: 12px; border-bottom: 1px solid #e0e0e0; }
    td:first-child { font-weight: bold; color: #666; width: 40%; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 14px; font-family: 'Bai Jamjuree', Arial, sans-serif; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div style="display: flex; align-items: center; justify-content: center; gap: 15px;">
        <div class="logo">KAAGAZ</div>
        <h1 style="margin: 0;">🎯 New Brand Audit Request</h1>
      </div>
    </div>
    
    <div class="content">
      <p style="font-size: 16px; margin-bottom: 20px;">A new brand audit request has been submitted:</p>
      
      <div class="info-box">
        <h3 style="margin-top: 0; color: #DC2626;">Contact Information</h3>
        <table>
          <tr>
            <td>Name</td>
            <td>${data.name}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td><a href="mailto:${data.email}" style="color: #DC2626;">${data.email}</a></td>
          </tr>
          <tr>
            <td>Phone</td>
            <td><a href="tel:${data.phone}" style="color: #DC2626;">${data.phone}</a></td>
          </tr>
        </table>
      </div>
      
      <div class="info-box">
        <h3 style="margin-top: 0; color: #DC2626;">Brand Details</h3>
        <table>
          <tr>
            <td>Brand Name</td>
            <td><strong>${data.brandName}</strong></td>
          </tr>
          <tr>
            <td>Business</td>
            <td>${data.business}</td>
          </tr>
          <tr>
            <td>Sales Channel</td>
            <td>${data.salesChannel}</td>
          </tr>
          ${data.websiteUrl ? `<tr><td>Website</td><td><a href="${data.websiteUrl}" style="color: #DC2626;">${data.websiteUrl}</a></td></tr>` : ''}
        </table>
      </div>
      
      ${data.instagram || data.facebook || data.linkedin ? `
      <div class="info-box">
        <h3 style="margin-top: 0; color: #DC2626;">Social Media</h3>
        <table>
          ${data.instagram ? `<tr><td>Instagram</td><td>${data.instagram}</td></tr>` : ''}
          ${data.facebook ? `<tr><td>Facebook</td><td>${data.facebook}</td></tr>` : ''}
          ${data.linkedin ? `<tr><td>LinkedIn</td><td>${data.linkedin}</td></tr>` : ''}
        </table>
      </div>
      ` : ''}
      
      <p style="margin-top: 30px; padding: 15px; background-color: #FEF2F2; border-left: 4px solid #DC2626; border-radius: 4px;">
        <strong>⏰ Action Required:</strong> Please review the details and reach out to the client within 24 hours.
      </p>
    </div>
    
    <div class="footer">
      <p>Submitted on: ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>
      <p style="margin-top: 10px; font-size: 12px; color: #999;">
        This is an automated notification from your Brand Audit Form
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

function generateAdminNotificationText(data) {
  return `
NEW BRAND AUDIT REQUEST
=======================

Contact Information:
- Name: ${data.name}
- Email: ${data.email}
- Phone: ${data.phone}

- Brand Name: ${data.brandName}
- Business: ${data.business}
- Sales Channel: ${data.salesChannel}
${data.websiteUrl ? `- Website: ${data.websiteUrl}` : ''}

${data.instagram || data.facebook || data.linkedin ? `Social Media:` : ''}
${data.instagram ? `- Instagram: ${data.instagram}` : ''}
${data.facebook ? `- Facebook: ${data.facebook}` : ''}
${data.linkedin ? `- LinkedIn: ${data.linkedin}` : ''}

Submitted: ${new Date().toLocaleString()}

ACTION REQUIRED: Please review and contact within 24 hours.
  `.trim();
}

// Email template generator (legacy - keeping for reference)
function generateConfirmationEmail(data) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Brand Audit Confirmation</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 40px auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { font-size: 32px; font-weight: bold; color: #DC2626; margin-bottom: 10px; }
    h1 { color: #333; font-size: 24px; margin-bottom: 20px; }
    .content { margin: 20px 0; }
    .highlight { background-color: #FEF2F2; border-left: 4px solid #DC2626; padding: 15px; margin: 20px 0; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 14px; }
    .button { display: inline-block; background-color: #DC2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">KAAGAZ</div>
    </div>
    
    <h1>Thank You, ${data.name}! 🎉</h1>
    
    <div class="content">
      <p>Thank you for registering for your <strong>FREE Brand Audit</strong>!</p>
      
      <div class="highlight">
        <p style="margin: 0;"><strong>Your brand audit has been started!</strong></p>
        <p style="margin: 10px 0 0 0;">Our team will review <strong>${data.brandName}</strong> and reach out if we need any further details.</p>
      </div>
      
      <p><strong>Timeline:</strong> Your comprehensive audit will be completed within <strong>3 working days</strong>.</p>
      
      <p>We've received the following information:</p>
      <ul>
        <li><strong>Name:</strong> ${data.name}</li>
        <li><strong>Brand:</strong> ${data.brandName}</li>
        <li><strong>Business:</strong> ${data.business}</li>
        <li><strong>Sales Channels:</strong> ${data.salesChannel}</li>
        <li><strong>Email:</strong> ${data.email}</li>
        <li><strong>Phone:</strong> ${data.phone}</li>
        ${data.instagram ? `<li><strong>Instagram:</strong> ${data.instagram}</li>` : ''}
        ${data.facebook ? `<li><strong>Facebook:</strong> ${data.facebook}</li>` : ''}
        ${data.linkedin ? `<li><strong>LinkedIn:</strong> ${data.linkedin}</li>` : ''}
      </ul>
      
      <p>If you have any questions or concerns in the meantime, please don't hesitate to reach out to us.</p>
    </div>
    
    <div class="footer">
      <p><strong>Best Regards,</strong><br>Kaagaz Studios</p>
      <p style="margin-top: 20px;">
        <a href="mailto:info@kaagaz.co" style="color: #DC2626; text-decoration: none;">info@kaagaz.co</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

function generateConfirmationText(data) {
  return `
Thank You, ${data.name}!

Thank you for registering for your FREE Brand Audit!

Your brand audit has been started!
Our team will review ${data.brandName} and reach out if we need any further details.

Timeline: Your comprehensive audit will be completed within 3 working days.

We've received the following information:
- Name: ${data.name}
- Brand: ${data.brandName}
- Business: ${data.business}
- Sales Channels: ${data.salesChannel}
- Email: ${data.email}
- Phone: ${data.phone}
${data.instagram ? `- Instagram: ${data.instagram}` : ''}
${data.facebook ? `- Facebook: ${data.facebook}` : ''}
${data.linkedin ? `- LinkedIn: ${data.linkedin}` : ''}

If you have any questions or concerns in the meantime, please don't hesitate to reach out to us.

Best Regards,
Kaagaz Studios

info@kaagaz.co
  `.trim();
}

// Zoho Mail implementation (SMTP)
async function sendWithZoho(emailData) {
  // Using Nodemailer with Zoho SMTP
  const nodemailer = require('nodemailer');
  
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.ZOHO_MAIL_USER,
      pass: process.env.ZOHO_MAIL_PASSWORD
    }
  });

  await transporter.sendMail({
    from: `"Kaagaz Studios" <${emailData.from}>`,
    to: emailData.to,
    subject: emailData.subject,
    text: emailData.text,
    html: emailData.html
  });
}

// SendGrid implementation
async function sendWithSendGrid(emailData) {
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: emailData.to }] }],
      from: { email: emailData.from, name: 'Kaagaz Studios' },
      subject: emailData.subject,
      content: [
        { type: 'text/plain', value: emailData.text },
        { type: 'text/html', value: emailData.html }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`SendGrid error: ${response.statusText}`);
  }
}

// Resend implementation
async function sendWithResend(emailData) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: emailData.from,
      to: [emailData.to],
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text
    })
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Resend API error:', errorData);
    throw new Error(`Resend error: ${response.statusText}`);
  }
}

// Mailgun implementation
async function sendWithMailgun(emailData) {
  const domain = process.env.MAILGUN_DOMAIN || 'mg.kaagaz.co';
  const formData = new URLSearchParams({
    from: `Kaagaz Studios <${emailData.from}>`,
    to: emailData.to,
    subject: emailData.subject,
    text: emailData.text,
    html: emailData.html
  });

  const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`api:${process.env.MAILGUN_API_KEY}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Mailgun error: ${response.statusText}`);
  }
}
