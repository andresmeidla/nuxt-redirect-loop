import jwt from 'jsonwebtoken';

export default defineEventHandler((event) => {
  const parsedUrl = new URL(event.node.req.url ?? '/', 'http://localhost');
  const pathname = parsedUrl.pathname;
  if (pathname.startsWith('/login')) {
    console.log('Allow', pathname);
    return;
  }
  const authCookie = getCookie(event, 'myToken');
  if (authCookie) {
    try {
      const decoded = jwt.verify(authCookie, useRuntimeConfig().jwtSecret);
      if (decoded) {
        console.log('Auth Success', pathname);
        event.context.auth = decoded;
        return;
      }
    } catch (e) {
      console.warn('While verifying token:', e);
      deleteCookie(event, 'myToken');
    }
  }
  console.log('Redirecting to login', event.node.req.url);
  // redirecting
  return sendRedirect(event, `/login?initial=${event.node.req.url}`, 307);
});
