// Vercel Serverless Function for Contact Form
// Sends email using Resend API (https://resend.com)
// Set RESEND_API_KEY environment variable in Vercel

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { name, email, subject, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Invalid email address' });
      return;
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const TO_EMAIL = 'hobelsbergeralex@gmail.com';
    const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev'; // Default Resend email

    if (!RESEND_API_KEY) {
      // If no API key, log and return success (for development)
      console.log('Contact form submission (no API key):', {
        to: TO_EMAIL,
        from: email,
        name,
        subject: subject || 'Contact Form Submission from Website',
        message
      });
      res.status(200).json({ success: true, message: 'Email logged (API key not configured)' });
      return;
    }

    // Send email using Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: TO_EMAIL,
        reply_to: email,
        subject: subject || `Contact Form Submission from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject || 'Contact Form Submission from Website'}</p>
          <hr>
          <h3>Message:</h3>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
        text: `
New Contact Form Submission

From: ${name} (${email})
Subject: ${subject || 'Contact Form Submission from Website'}

Message:
${message}
        `
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Resend API error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json({ success: true, message: 'Email sent successfully', id: data.id });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: error.message || 'Failed to send email' });
  }
}

