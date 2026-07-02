const User = require('../models/User');

const promoteAdmin = async () => {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  if (!ADMIN_EMAIL) {
    console.log('[Admin Seed] ADMIN_EMAIL env var not set — skipping admin promotion. Set it in Render to auto-promote on boot.');
    return;
  }

  try {
    const user = await User.findOne({ email: ADMIN_EMAIL });
    if (!user) {
      console.log(`[Admin Seed] User with email ${ADMIN_EMAIL} not found. Register first, then restart.`);
      return;
    }
    if (user.role === 'admin') {
      console.log(`[Admin Seed] ${ADMIN_EMAIL} is already admin.`);
      return;
    }
    user.role = 'admin';
    await user.save();
    console.log(`[Admin Seed] Promoted ${ADMIN_EMAIL} to admin successfully.`);
  } catch (error) {
    console.error('[Admin Seed] Error promoting admin:', error.message);
  }
};

module.exports = { promoteAdmin };
