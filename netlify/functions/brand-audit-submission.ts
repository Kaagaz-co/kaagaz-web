// Netlify serverless function for brand audit form submission
// This function sends confirmation emails and stores submission data

import { Handler } from '@netlify/functions';

const handler: Handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    
    // Validate required fields
    const required = ['name', 'phone', 'brandName', 'business', 'email', 'salesChannel'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Missing required fields', 
          missing 
        })
      };
    }

    // Format email content
    const emailData = {
      to: data.email,
      from: 'info@kaagaz.co',
      subject: 'Thank You for Your FREE Brand Audit Request - Kaagaz Studios',
      html: generateConfirmationEmail(data),
      text: generateConfirmationText(data)
    };

    // Send email using your preferred service
    // Option 1: SendGrid
    if (process.env.SENDGRID_API_KEY) {
      await sendWithSendGrid(emailData);
    }
    // Option 2: Resend
    else if (process.env.RESEND_API_KEY) {
      await sendWithResend(emailData);
    }
    // Option 3: Mailgun
    else if (process.env.MAILGUN_API_KEY) {
      await sendWithMailgun(emailData);
    }
    // Fallback: Log to console (development)
    else {
      console.log('Email would be sent:', emailData);
      console.log('Form submission:', data);
    }

    // Optional: Store submission in database or Google Sheets
    // await storeInDatabase(data);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Form submitted successfully' 
      })
    };

  } catch (error) {
    console.error('Error processing form:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};

// Email template generator
function generateConfirmationEmail(data: any): string {
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

function generateConfirmationText(data: any): string {
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

// SendGrid implementation
async function sendWithSendGrid(emailData: any) {
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
async function sendWithResend(emailData: any) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `Kaagaz Studios <${emailData.from}>`,
      to: [emailData.to],
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text
    })
  });

  if (!response.ok) {
    throw new Error(`Resend error: ${response.statusText}`);
  }
}

// Mailgun implementation
async function sendWithMailgun(emailData: any) {
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

export { handler };
