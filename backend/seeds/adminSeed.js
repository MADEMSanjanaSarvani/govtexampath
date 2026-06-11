const User = require('../models/User');

const ADMIN_EMAIL = 'sanjanasarvani2111@gmail.com';

const promoteAdmin = async () => {
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
