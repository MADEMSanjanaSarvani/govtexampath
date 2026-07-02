const webpush = require('web-push');
const User = require('../models/User');

let vapidConfigured = false;

const initWebPush = () => {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!publicKey || !privateKey) {
    console.warn('VAPID keys not set — generating new keys. Set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY env vars for production.');
    const keys = webpush.generateVAPIDKeys();
    console.log('Generated VAPID keys — set both in your Render environment:');
    console.log('VAPID_PUBLIC_KEY=' + keys.publicKey);
    console.warn('VAPID_PRIVATE_KEY not logged for security — retrieve from Render env after first boot.');
    webpush.setVapidDetails('mailto:noreply@govtexampath.com', keys.publicKey, keys.privateKey);
    process.env.VAPID_PUBLIC_KEY = keys.publicKey;
    process.env.VAPID_PRIVATE_KEY = keys.privateKey;
  } else {
    webpush.setVapidDetails('mailto:noreply@govtexampath.com', publicKey, privateKey);
  }

  vapidConfigured = true;
  console.log('Web Push (VAPID) initialized for browser notifications');
};

const sendWebPush = async (subscription, title, body, data = {}) => {
  if (!vapidConfigured) return { success: 0, failure: 1 };

  const payload = JSON.stringify({
    title,
    body,
    icon: '/logo192.png',
    badge: '/logo192.png',
    data: { url: '/notifications', ...data },
  });

  try {
    await webpush.sendNotification(subscription, payload);
    return { success: 1, failure: 0 };
  } catch (err) {
    if (err.statusCode === 404 || err.statusCode === 410) {
      return { success: 0, failure: 1, expired: true };
    }
    return { success: 0, failure: 1 };
  }
};

const sendWebPushToAll = async (title, body, data = {}) => {
  if (!vapidConfigured) return { success: 0, failure: 0 };

  const users = await User.find({ 'webPushSubscriptions.0': { $exists: true } }).select('webPushSubscriptions');
  let success = 0;
  let failure = 0;
  const expiredSubs = [];

  for (const user of users) {
    for (const sub of user.webPushSubscriptions) {
      const result = await sendWebPush(sub.subscription, title, body, data);
      success += result.success;
      failure += result.failure;
      if (result.expired) {
        expiredSubs.push({ userId: user._id, endpoint: sub.subscription.endpoint });
      }
    }
  }

  // Clean up expired subscriptions
  for (const { userId, endpoint } of expiredSubs) {
    await User.findByIdAndUpdate(userId, {
      $pull: { webPushSubscriptions: { 'subscription.endpoint': endpoint } },
    });
  }

  return { success, failure };
};

const getVapidPublicKey = () => {
  if (!vapidConfigured) initWebPush();
  return process.env.VAPID_PUBLIC_KEY;
};

module.exports = { initWebPush, sendWebPush, sendWebPushToAll, getVapidPublicKey };
