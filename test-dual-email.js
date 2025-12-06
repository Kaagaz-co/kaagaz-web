import 'dotenv/config';

const testData = {
  name: 'Aman Test',
  phone: '+91 9876543210',
  brandName: 'Test Brand',
  business: 'We are a test business looking to improve our brand identity and market presence.',
  email: 'aman.kaagaz@gmail.com',
  websiteUrl: 'https://testbrand.com',
  instagram: '@testbrand',
  facebook: 'testbrand',
  linkedin: 'company/testbrand',
  salesChannel: 'Online & Retail'
};

async function sendTestEmails() {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.error('❌ RESEND_API_KEY not found in .env.local');
    return;
  }

  console.log('🚀 Testing dual email system...\n');
  console.log('Test Data:', JSON.stringify(testData, null, 2));
  console.log('\n📧 Sending emails...\n');

  // User confirmation email
  const userEmailHtml = `
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
    
    <h1>Hi ${testData.name},</h1>
    
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

  const userEmailText = `
Hi ${testData.name},

Thank you for registering for brand for FREE design audit by Kaagaz Studios.

We have received your details and we are glad to let you know that your brand audit has been started.

Our team will reach out in case any further details are required.

Once the audit is completed, our team will reach out with a detailed report.

Best Regards,

Kaagaz Studios
info@kaagaz.co
  `.trim();

  // Admin notification email
  const adminEmailHtml = `
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
    .header { background-color: #DC2626; color: white; padding: 20px; border-radius: 8px 8px 0 0; margin: -40px -40px 30px -40px; }
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
            <td>${testData.name}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td><a href="mailto:${testData.email}" style="color: #DC2626;">${testData.email}</a></td>
          </tr>
          <tr>
            <td>Phone</td>
            <td><a href="tel:${testData.phone}" style="color: #DC2626;">${testData.phone}</a></td>
          </tr>
        </table>
      </div>
      
      <div class="info-box">
        <h3 style="margin-top: 0; color: #DC2626;">Brand Details</h3>
        <table>
          <tr>
            <td>Brand Name</td>
            <td><strong>${testData.brandName}</strong></td>
          </tr>
          <tr>
            <td>Business</td>
            <td>${testData.business}</td>
          </tr>
          <tr>
            <td>Sales Channel</td>
            <td>${testData.salesChannel}</td>
          </tr>
          ${testData.websiteUrl ? `<tr><td>Website</td><td><a href="${testData.websiteUrl}" style="color: #DC2626;">${testData.websiteUrl}</a></td></tr>` : ''}
        </table>
      </div>
      
      <div class="info-box">
        <h3 style="margin-top: 0; color: #DC2626;">Social Media</h3>
        <table>
          <tr><td>Instagram</td><td>${testData.instagram}</td></tr>
          <tr><td>Facebook</td><td>${testData.facebook}</td></tr>
          <tr><td>LinkedIn</td><td>${testData.linkedin}</td></tr>
        </table>
      </div>
      
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

  const adminEmailText = `
NEW BRAND AUDIT REQUEST
=======================

Contact Information:
- Name: ${testData.name}
- Email: ${testData.email}
- Phone: ${testData.phone}

Brand Details:
- Brand Name: ${testData.brandName}
- Business: ${testData.business}
- Sales Channel: ${testData.salesChannel}
${testData.websiteUrl ? `- Website: ${testData.websiteUrl}` : ''}

Social Media:
- Instagram: ${testData.instagram}
- Facebook: ${testData.facebook}
- LinkedIn: ${testData.linkedin}

Submitted: ${new Date().toLocaleString()}

ACTION REQUIRED: Please review and contact within 24 hours.
  `.trim();

  try {
    // Send user confirmation email
    console.log('1️⃣ Sending user confirmation to:', testData.email);
    const userResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Kaagaz Studios <info@kaagaz.co>',
        to: testData.email,
        subject: 'Thank you for registering for FREE brand Audit',
        html: userEmailHtml,
        text: userEmailText
      })
    });

    const userResult = await userResponse.json();
    
    if (userResponse.ok) {
      console.log('   ✅ User confirmation sent successfully!');
      console.log('   Email ID:', userResult.id);
    } else {
      console.error('   ❌ Failed to send user confirmation:', userResult);
    }

    console.log('');

    // Send admin notification email
    console.log('2️⃣ Sending admin notification to: info@kaagaz.co');
    const adminResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Brand Audit Form <info@kaagaz.co>',
        to: 'info@kaagaz.co',
        subject: `New Brand Audit Request - ${testData.brandName}`,
        html: adminEmailHtml,
        text: adminEmailText
      })
    });

    const adminResult = await adminResponse.json();
    
    if (adminResponse.ok) {
      console.log('   ✅ Admin notification sent successfully!');
      console.log('   Email ID:', adminResult.id);
    } else {
      console.error('   ❌ Failed to send admin notification:', adminResult);
    }

    console.log('\n✨ Test complete! Check both inboxes:');
    console.log('   - User:', testData.email);
    console.log('   - Admin: info@kaagaz.co');

  } catch (error) {
    console.error('❌ Error sending emails:', error.message);
  }
}

sendTestEmails();
