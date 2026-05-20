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

  let name, email;
  try {
    const body = JSON.parse(event.body);
    name = body.name;
    email = body.email;
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Valid email is required' }) };
  }

  const firstName = (name || 'there').split(' ')[0];

  try {
    await fetch(`${BREVO_API_URL}/contacts`, {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        listIds: [3],
        updateEnabled: true,
        attributes: {
          FIRSTNAME: firstName,
          SIGNUP_SOURCE: 'website_registration',
          SIGNUP_DATE: new Date().toISOString().split('T')[0],
        },
      }),
    });

    await fetch(`${BREVO_API_URL}/smtp/email`, {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: [{ email, name: name || undefined }],
        sender: { name: 'GovtExamPath', email: 'govtexampath@gmail.com' },
        subject: `Welcome to GovtExamPath, ${firstName}! 🎯 Your Exam Journey Starts Here`,
        htmlContent: `
          <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
            <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <div style="width: 56px; height: 56px; background: rgba(255,255,255,0.2); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                <span style="color: white; font-weight: bold; font-size: 28px;">G</span>
              </div>
              <h1 style="color: white; margin: 0; font-size: 26px;">Welcome to GovtExamPath!</h1>
              <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 15px;">Your account is ready. Let's get started!</p>
            </div>
            <div style="padding: 30px; color: #374151;">
              <p style="font-size: 16px; line-height: 1.6;">Hi ${firstName},</p>
              <p style="font-size: 15px; line-height: 1.7;">Congratulations on creating your GovtExamPath account! You now have access to India's most comprehensive free platform for government exam preparation.</p>

              <h3 style="font-size: 16px; color: #1f2937; margin: 24px 0 12px;">Here's what you can do now:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px; background: #f0f9ff; border-radius: 8px 8px 0 0; border-bottom: 1px solid #e0f2fe;">
                    <strong style="color: #1e40af;">🤖 AI Career Guide</strong>
                    <p style="margin: 4px 0 0; font-size: 13px; color: #6b7280;">Get personalized exam recommendations based on your profile</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px; background: #f0fdf4; border-bottom: 1px solid #dcfce7;">
                    <strong style="color: #166534;">✅ Eligibility Checker</strong>
                    <p style="margin: 4px 0 0; font-size: 13px; color: #6b7280;">Instantly check your eligibility for 200+ government exams</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px; background: #fef3c7; border-bottom: 1px solid #fde68a;">
                    <strong style="color: #92400e;">📅 Exam Calendar</strong>
                    <p style="margin: 4px 0 0; font-size: 13px; color: #6b7280;">Never miss a deadline with real-time exam schedules</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px; background: #fdf2f8; border-radius: 0 0 8px 8px;">
                    <strong style="color: #9d174d;">🧠 Mind Maps & Resources</strong>
                    <p style="margin: 4px 0 0; font-size: 13px; color: #6b7280;">Free study materials, mind maps, and preparation tips</p>
                  </td>
                </tr>
              </table>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://govtexampath.com/dashboard" style="display: inline-block; background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; padding: 14px 36px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 15px;">Go to Your Dashboard</a>
              </div>

              <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin: 20px 0;">
                <p style="margin: 0; font-size: 13px; color: #6b7280; text-align: center;">
                  Explore: <a href="https://govtexampath.com/exams" style="color: #4f46e5;">Browse 200+ Exams</a> ·
                  <a href="https://govtexampath.com/ai-guide" style="color: #4f46e5;">AI Career Guide</a> ·
                  <a href="https://govtexampath.com/current-affairs" style="color: #4f46e5;">Current Affairs</a>
                </p>
              </div>

              <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin-top: 20px;">
                You'll also receive weekly updates on new exam notifications, results, and admit card releases. Stay ahead in your preparation!
              </p>
            </div>
            <div style="background: #f9fafb; padding: 20px 30px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">GovtExamPath · New Delhi, India · <a href="https://govtexampath.com" style="color: #6b7280;">govtexampath.com</a></p>
            </div>
          </div>
        `,
      }),
    });

    return { statusCode: 200, headers, body: JSON.stringify({ message: 'Welcome email sent!' }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to send welcome email.' }) };
  }
};
