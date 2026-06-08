const BREVO_API_URL = 'https://api.brevo.com/v3';

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Email service not configured' }) };
  }

  let email;
  try {
    const body = JSON.parse(event.body);
    email = body.email;
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Valid email is required' }) };
  }

  try {
    const contactRes = await fetch(`${BREVO_API_URL}/contacts`, {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        listIds: [3],
        updateEnabled: true,
        attributes: { SIGNUP_SOURCE: 'website_newsletter', SIGNUP_DATE: new Date().toISOString().split('T')[0] },
      }),
    });

    if (!contactRes.ok) {
      const errorData = await contactRes.json();
      if (errorData.code === 'duplicate_parameter') {
        return { statusCode: 200, headers, body: JSON.stringify({ message: 'You are already subscribed!' }) };
      }
      throw new Error(errorData.message || 'Failed to add contact');
    }

    await fetch(`${BREVO_API_URL}/smtp/email`, {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: [{ email }],
        sender: { name: 'GovtExamPath', email: 'govtexampath@gmail.com' },
        subject: 'Welcome to GovtExamPath - Exam Updates Subscription',
        htmlContent: `
          <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
            <div style="background: linear-gradient(135deg, #2563eb, #4f46e5); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <div style="width: 50px; height: 50px; background: rgba(255,255,255,0.2); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                <span style="color: white; font-weight: bold; font-size: 24px;">G</span>
              </div>
              <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to GovtExamPath!</h1>
              <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">India's Free Career Guidance Platform</p>
            </div>
            <div style="padding: 30px; color: #374151;">
              <p style="font-size: 16px; line-height: 1.6;">Hi there!</p>
              <p style="font-size: 15px; line-height: 1.6;">Thank you for subscribing to GovtExamPath updates. You'll now receive:</p>
              <ul style="font-size: 14px; line-height: 1.8; color: #4b5563;">
                <li><strong>Weekly exam notifications</strong> - New exam announcements and deadlines</li>
                <li><strong>Result alerts</strong> - When results are declared for major exams</li>
                <li><strong>Admit card reminders</strong> - Download links when admit cards are released</li>
                <li><strong>Preparation tips</strong> - Expert strategies and study plans</li>
              </ul>
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://govtexampath.com/exams" style="display: inline-block; background: linear-gradient(135deg, #2563eb, #4f46e5); color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Browse 200+ Exams</a>
              </div>
              <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin: 20px 0;">
                <p style="margin: 0; font-size: 13px; color: #6b7280;">Quick links: <a href="https://govtexampath.com/ai-guide" style="color: #2563eb;">Career Guide</a> · <a href="https://govtexampath.com/eligibility-checker" style="color: #2563eb;">Eligibility Checker</a> · <a href="https://govtexampath.com/exam-calendar" style="color: #2563eb;">Exam Calendar</a></p>
              </div>
            </div>
            <div style="background: #f9fafb; padding: 20px 30px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">GovtExamPath · New Delhi, India · <a href="https://govtexampath.com" style="color: #6b7280;">govtexampath.com</a></p>
            </div>
          </div>
        `,
      }),
    });

    return { statusCode: 200, headers, body: JSON.stringify({ message: 'Subscribed successfully! Check your inbox.' }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Subscription failed. Please try again.' }) };
  }
};
