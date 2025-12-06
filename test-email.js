// Simple test script to verify Zoho Mail is working
// Run with: node test-email.js

import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config({ path: '.env.local' });

async function testZohoMail() {
  console.log('🔧 Testing Zoho Mail configuration...\n');
  
  // Check environment variables
  if (!process.env.ZOHO_MAIL_USER || !process.env.ZOHO_MAIL_PASSWORD) {
    console.error('❌ Error: Missing environment variables!');
    console.log('Make sure .env.local has:');
    console.log('  ZOHO_MAIL_USER=info@kaagaz.co');
    console.log('  ZOHO_MAIL_PASSWORD=your_app_password');
    return;
  }

  console.log('✓ Environment variables found');
  console.log(`  Email: ${process.env.ZOHO_MAIL_USER}\n`);

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_MAIL_USER,
        pass: process.env.ZOHO_MAIL_PASSWORD
      }
    });

    console.log('📧 Sending test email...');

    // Send test email
    const info = await transporter.sendMail({
      from: `"Kaagaz Studios" <${process.env.ZOHO_MAIL_USER}>`,
      to: process.env.ZOHO_MAIL_USER, // Send to yourself for testing
      subject: 'Test Email - Brand Audit Form',
      text: 'This is a test email from your brand audit form. If you receive this, Zoho Mail is working correctly!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #DC2626;">Test Email ✅</h2>
          <p>This is a test email from your brand audit form.</p>
          <p><strong>If you receive this, Zoho Mail is working correctly!</strong></p>
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 14px;">
            Sent from: Kaagaz Studios<br>
            Test Date: ${new Date().toLocaleString()}
          </p>
        </div>
      `
    });

    console.log('\n✅ Success! Email sent successfully!');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Check your inbox: ${process.env.ZOHO_MAIL_USER}\n`);

  } catch (error) {
    console.error('\n❌ Error sending email:');
    console.error(`   ${error.message}\n`);
    
    if (error.code === 'EAUTH') {
      console.log('💡 Troubleshooting tips:');
      console.log('   1. Check your app-specific password is correct');
      console.log('   2. Make sure IMAP is enabled in Zoho Mail settings');
      console.log('   3. Try generating a new app-specific password');
      console.log('   4. Visit: https://accounts.zoho.com → Security → App Passwords\n');
    }
  }
}

// Run the test
testZohoMail();
