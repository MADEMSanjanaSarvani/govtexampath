// Holds the CSRF token in memory only (never persisted) — see
// backend/middleware/csrf.js for why this exists. A plain module-level
// variable (not React state) so the axios interceptor in api.js, which
// isn't a component, can read the current value synchronously.
let csrfToken = null;

export const setCsrfToken = (token) => {
  csrfToken = token || null;
};

export const getCsrfToken = () => csrfToken;
