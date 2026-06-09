const https = require('https');

const sendNotificationEmail = (recipients, subject, htmlContent) => {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn('BREVO_API_KEY not set — email notifications disabled');
    return Promise.resolve({ success: 0, failure: 0 });
  }

  const batchSize = 50;
  const batches = [];
  for (let i = 0; i < recipients.length; i += batchSize) {
    batches.push(recipients.slice(i, i + batchSize));
  }

  let success = 0;
  let failure = 0;

  const sendBatch = (batch) => {
    return new Promise((resolve) => {
      const to = batch.map((r) => ({
        email: r.email,
        name: r.name || r.email.split('@')[0],
      }));

      const payload = JSON.stringify({
        sender: { name: 'GovtExamPath', email: 'noreply@govtexampath.com' },
        to,
        subject,
        htmlContent,
      });

      const options = {
        hostname: 'api.brevo.com',
        path: '/v3/smtp/email',
        method: 'POST',
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            success += batch.length;
          } else {
            failure += batch.length;
            console.error('Brevo email error:', data);
          }
          resolve();
        });
      });

      req.on('error', (err) => {
        failure += batch.length;
        console.error('Email send error:', err.message);
        resolve();
      });

      req.write(payload);
      req.end();
    });
  };

  return Promise.all(batches.map(sendBatch)).then(() => ({ success, failure }));
};

const buildNotificationEmailHTML = (title, message, type) => {
  const typeColors = {
    exam_schedule: '#2563eb',
    hall_ticket: '#7c3aed',
    result: '#059669',
    assignment: '#d97706',
    fee_reminder: '#dc2626',
    placement: '#0891b2',
    announcement: '#4f46e5',
    general: '#6b7280',
  };

  const typeLabels = {
    exam_schedule: 'Exam Schedule',
    hall_ticket: 'Hall Ticket',
    result: 'Result',
    assignment: 'Assignment',
    fee_reminder: 'Fee Reminder',
    placement: 'Placement Drive',
    announcement: 'Announcement',
    general: 'Notification',
  };

  const color = typeColors[type] || typeColors.general;
  const label = typeLabels[type] || typeLabels.general;

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f3f4f6">
<div style="max-width:600px;margin:0 auto;padding:20px">
  <div style="background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">
    <div style="background:${color};padding:24px 32px">
      <h1 style="color:white;margin:0;font-size:22px">GovtExamPath</h1>
      <span style="color:rgba(255,255,255,0.85);font-size:13px">${label}</span>
    </div>
    <div style="padding:32px">
      <h2 style="color:#1f2937;margin:0 0 16px;font-size:20px">${title}</h2>
      <p style="color:#4b5563;line-height:1.6;margin:0 0 24px;font-size:15px">${message}</p>
      <a href="https://govtexampath.com/notifications" style="display:inline-block;background:${color};color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">View Details</a>
    </div>
    <div style="border-top:1px solid #e5e7eb;padding:16px 32px;text-align:center">
      <p style="color:#9ca3af;font-size:12px;margin:0">You received this because you're registered on GovtExamPath.com</p>
    </div>
  </div>
</div>
</body></html>`;
};

module.exports = { sendNotificationEmail, buildNotificationEmailHTML };
