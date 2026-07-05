const crypto = require('crypto');

const botAuth = (req, res, next) => {
  const apiKey = req.headers['x-bot-api-key'];
  const validKey = process.env.BOT_API_KEY;

  if (!validKey) {
    return res.status(503).json({ success: false, error: 'Bot API not configured.' });
  }

  if (!apiKey || apiKey.length !== validKey.length ||
      !crypto.timingSafeEqual(Buffer.from(apiKey), Buffer.from(validKey))) {
    return res.status(401).json({ success: false, error: 'Invalid or missing API key.' });
  }

  next();
};

module.exports = { botAuth };
