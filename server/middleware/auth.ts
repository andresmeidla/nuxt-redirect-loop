export default defineEventHandler((event) => {
  const parsedUrl = new URL(event.node.req.url ?? '/', 'http://localhost');
  const pathname = parsedUrl.pathname;
  if (pathname.startsWith('/login')) {
    console.log(pathname, 'Allow');
    return;
  }
  const authCookie = getCookie(event, 'myToken');
  if (authCookie) {
    console.log(pathname, 'Cookie found, allow');
    return;
  }
  console.log(pathname, 'Redirecting to login');
  // redirecting
  // return sendRedirect(event, `/login?initial=${event.node.req.url}`, 307);
  return sendRedirect(event, '/login', 307);
});
