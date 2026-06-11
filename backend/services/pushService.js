const admin = require('firebase-admin');

let firebaseInitialized = false;

const initFirebase = () => {
  if (firebaseInitialized) return;

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccount) {
    console.warn('FIREBASE_SERVICE_ACCOUNT not set — push notifications disabled');
    return;
  }

  try {
    const parsed = JSON.parse(serviceAccount);
    admin.initializeApp({
      credential: admin.credential.cert(parsed),
    });
    firebaseInitialized = true;
    console.log('Firebase Admin initialized for push notifications');
  } catch (err) {
    console.error('Firebase init error:', err.message);
  }
};

const sendPushNotification = async (tokens, title, body, data = {}) => {
  if (!firebaseInitialized) {
    initFirebase();
    if (!firebaseInitialized) return { success: 0, failure: 0 };
  }

  if (!tokens || tokens.length === 0) return { success: 0, failure: 0 };

  const message = {
    notification: { title, body },
    data: { ...data, click_action: 'OPEN_APP' },
    android: {
      priority: 'high',
      notification: {
        sound: 'default',
        channelId: 'govtexampath_notifications',
      },
    },
  };

  const results = { success: 0, failure: 0, invalidTokens: [] };

  for (const token of tokens) {
    try {
      await admin.messaging().send({ ...message, token });
      results.success++;
    } catch (err) {
      results.failure++;
      if (
        err.code === 'messaging/invalid-registration-token' ||
        err.code === 'messaging/registration-token-not-registered'
      ) {
        results.invalidTokens.push(token);
      }
    }
  }

  return results;
};

const sendToUser = async (user, title, body, data = {}) => {
  if (!user.fcmTokens || user.fcmTokens.length === 0) return;
  const tokens = user.fcmTokens.map((t) => t.token);
  return sendPushNotification(tokens, title, body, data);
};

const sendToAllUsers = async (User, title, body, data = {}) => {
  const users = await User.find({ 'fcmTokens.0': { $exists: true } }).select('fcmTokens');
  const allTokens = users.flatMap((u) => u.fcmTokens.map((t) => t.token));
  if (allTokens.length === 0) return;
  return sendPushNotification(allTokens, title, body, data);
};

module.exports = { initFirebase, sendPushNotification, sendToUser, sendToAllUsers };
