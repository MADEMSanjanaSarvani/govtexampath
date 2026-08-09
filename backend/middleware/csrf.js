const crypto = require('crypto');

/**
 * CSRF protection for the httpOnly-cookie auth session.
 *
 * The frontend (govtexampath.com) and this API (a different registrable
 * domain, e.g. onrender.com) are cross-site, so the session cookie must be
 * SameSite=None — meaning the browser attaches it automatically to
 * state-changing requests from *any* origin, not just our own frontend. The
 * classic double-submit-cookie CSRF defense doesn't work here because it
 * relies on frontend JS reading a cookie set by the API, which is impossible
 * across two different domains (cookies are domain-scoped).
 *
 * Instead: whenever the auth cookie is issued, the API also returns an HMAC
 * of that token in the JSON response body (see authController.js). The
 * frontend holds this value in memory (never persisted) and echoes it back
 * as an X-CSRF-Token header on every state-changing request. Since the HMAC
 * is deterministic from the token + a server secret, this needs no server-
 * side session storage — it's just recomputed and compared here.
 *
 * A page on another site can make the browser SEND our cookie, but it has no
 * way to read or guess the matching CSRF token (it was only ever delivered
 * in a same-origin JSON response body, never as a cookie or URL), so it
 * can't produce a request that passes this check.
 */
const computeCsrfToken = (authToken) => {
  const secret = `${process.env.JWT_SECRET}:csrf`;
  return crypto.createHmac('sha256', secret).update(authToken).digest('hex');
};

const STATE_CHANGING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

const csrfProtection = (req, res, next) => {
  if (!STATE_CHANGING_METHODS.has(req.method)) return next();

  const authCookie = req.cookies?.token;
  // Only cookie-authenticated requests are CSRF-exploitable — a request
  // using the Authorization header instead isn't auto-attached by browsers,
  // so it isn't vulnerable the same way and doesn't need this check.
  if (!authCookie) return next();

  const expected = computeCsrfToken(authCookie);
  const provided = req.headers['x-csrf-token'];

  if (!provided || provided !== expected) {
    return res.status(403).json({ success: false, error: 'Invalid or missing CSRF token.' });
  }

  next();
};

module.exports = { csrfProtection, computeCsrfToken };
