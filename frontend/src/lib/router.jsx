/**
 * React Router DOM compatibility shim for Next.js Pages Router.
 * Replaces 'react-router-dom' imports across the codebase.
 */
import { useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter as useNextRouter } from 'next/router';

// Link: accepts both `to` (React Router) and `href` (Next.js)
export function Link({ to, href, children, replace: linkReplace, state, ...props }) {
  const dest = to !== undefined ? to : href;
  return <NextLink href={dest || '/'} replace={linkReplace} {...props}>{children}</NextLink>;
}

// useNavigate: returns a navigate function
export function useNavigate() {
  const router = useNextRouter();
  return (to, options = {}) => {
    if (typeof to === 'number') { router.back(); return; }
    if (options?.replace) router.replace(to);
    else router.push(to);
  };
}

// useParams: returns URL dynamic segments via router.query
export function useParams() {
  const { query } = useNextRouter();
  return query;
}

// useSearchParams: returns [searchParams, setSearchParams] compatible object
export function useSearchParams() {
  const router = useNextRouter();
  const searchParams = {
    get(key) {
      const val = router.query[key];
      if (Array.isArray(val)) return val[0] ?? null;
      return val ?? null;
    },
    getAll(key) {
      const val = router.query[key];
      if (!val) return [];
      return Array.isArray(val) ? val : [val];
    },
    has(key) { return key in router.query; },
    toString() {
      const p = new URLSearchParams();
      Object.entries(router.query).forEach(([k, v]) => {
        if (Array.isArray(v)) v.forEach(x => p.append(k, x));
        else if (v !== undefined) p.set(k, v);
      });
      return p.toString();
    },
  };

  const setSearchParams = (updater) => {
    let newParams;
    if (typeof updater === 'function') {
      const current = new URLSearchParams(searchParams.toString());
      const result = updater(current);
      newParams = result || current;
    } else {
      newParams = updater;
    }
    const query = {};
    if (newParams && typeof newParams.entries === 'function') {
      for (const [k, v] of newParams.entries()) { query[k] = v; }
    }
    router.push({ pathname: router.pathname, query }, undefined, { shallow: true });
  };

  return [searchParams, setSearchParams];
}

// useLocation: returns { pathname, search, hash, state }
export function useLocation() {
  const router = useNextRouter();
  const asPath = router.asPath || '';
  const qIdx = asPath.indexOf('?');
  const hIdx = asPath.indexOf('#');
  const pathname = qIdx > -1
    ? asPath.substring(0, qIdx)
    : hIdx > -1 ? asPath.substring(0, hIdx) : asPath;
  const search = qIdx > -1
    ? asPath.substring(qIdx, hIdx > -1 ? hIdx : undefined)
    : '';
  const hash = hIdx > -1 ? asPath.substring(hIdx) : '';
  return { pathname, search, hash, state: null };
}

// Navigate: redirect component (replaces <Navigate to="..." replace />)
export function Navigate({ to, replace }) {
  const router = useNextRouter();
  useEffect(() => {
    if (replace) router.replace(to);
    else router.push(to);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to]);
  return null;
}

// useMatch: simplified version (checks if pathname matches a pattern)
export function useMatch(pattern) {
  const { pathname } = useLocation();
  if (typeof pattern === 'string') return pathname === pattern ? { pathname } : null;
  return null;
}
