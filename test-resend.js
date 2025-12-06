// Test script for Resend email service
// Run with: node test-resend.js

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testResend() {
  console.log('🔧 Testing Resend email service...\n');
  
  // Check environment variable
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ Error: RESEND_API_KEY not found in .env.local');
    console.log('\n📝 Setup steps:');
    console.log('1. Go to https://resend.com and sign up (free)');
    console.log('2. Add domain: kaagaz.co');
    console.log('3. Get API key from: https://resend.com/api-keys');
    console.log('4. Add to .env.local: RESEND_API_KEY=re_xxxxx\n');
    return;
  }

  console.log('✓ API key found');
  console.log(`  Key: ${process.env.RESEND_API_KEY.substring(0, 10)}...\n`);

  try {
    console.log('📧 Sending test email...');

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Kaagaz Studios <onboarding@resend.dev>', // Use Resend's test domain first
        to: ['info@kaagaz.co'],
        subject: 'Test Email - Brand Audit Form',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #DC2626;">Test Email ✅</h2>
            <p>This is a test email from your brand audit form.</p>
            <p><strong>If you receive this, Resend is working correctly!</strong></p>
            <hr style="margin: 20px 0;">
            <p style="color: #666; font-size: 14px;">
              Sent from: Kaagaz Studios<br>
              Test Date: ${new Date().toLocaleString()}
            </p>
          </div>
        `
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error, null, 2));
    }

    const result = await response.json();
    console.log('\n✅ Success! Email sent successfully!');
    console.log(`   Email ID: ${result.id}`);
    console.log(`   Check your inbox: info@kaagaz.co\n`);
    console.log('📝 Next steps:');
    console.log('1. Verify domain kaagaz.co in Resend dashboard');
    console.log('2. Update "from" address to info@kaagaz.co');
    console.log('3. Deploy to Vercel with RESEND_API_KEY\n');

  } catch (error) {
    console.error('\n❌ Error sending email:');
    console.error(`   ${error.message}\n`);
    
    console.log('💡 Troubleshooting tips:');
    console.log('1. Check your API key is correct');
    console.log('2. Make sure you copied the full key (starts with "re_")');
    console.log('3. Verify at: https://resend.com/api-keys');
    console.log('4. Try generating a new API key\n');
  }
}

// Run the test
testResend();
