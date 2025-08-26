// Netlify Function: Triggered when a Netlify Form submission is created
// Sends an email to info@kaagaz.co using the Resend API.
// Set RESEND_API_KEY in Netlify -> Site settings -> Environment variables.

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const payload = body && body.payload ? body.payload : body;
    const data = payload && payload.data ? payload.data : {};

    // Ignore spam via honeypot
    if (data['bot-field']) {
      return { statusCode: 200, body: 'Ignored bot submission' };
    }

    const name = data.name || 'Anonymous';
    const email = data.email || 'N/A';
    const subject = data.subject || 'New contact form submission';
    const message = data.message || '';

    const site = payload && (payload.site_url || payload.siteUrl) ? (payload.site_url || payload.siteUrl) : '';
    const submittedAt = payload && payload.created_at ? payload.created_at : new Date().toISOString();

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not set; skipping email send');
      return { statusCode: 200, body: 'No email provider configured' };
    }

    const emailBody = `You received a new contact form submission.\n\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Subject: ${subject}\n` +
      `Message:\n${message}\n\n` +
      `Submitted at: ${submittedAt}\n` +
      (site ? `Site: ${site}\n` : '');

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'noreply@kaagaz.co',
        to: ['info@kaagaz.co'],
        subject: `[Kaagaz] ${subject}`,
        text: emailBody
      })
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('Resend API error', res.status, text);
      // Do not fail the Netlify forms processing; log only
      return { statusCode: 200, body: 'Submission received; email send failed' };
    }

    return { statusCode: 200, body: 'Submission received; email sent' };
  } catch (err) {
    console.error('submission-created error', err);
    return { statusCode: 200, body: 'Submission received; function error' };
  }
};
