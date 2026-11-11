const APP_ROUTES = ["/copilotkit", "/status"];

export function isAppRoute(path: string): boolean {
  return APP_ROUTES.some((route) => path === route || path.startsWith(`${route}/`));
}
