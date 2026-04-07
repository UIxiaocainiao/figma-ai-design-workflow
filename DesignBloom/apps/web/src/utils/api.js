const PRODUCTION_API_ORIGIN = "https://designbloom-api-production.up.railway.app";
const STATIC_SITE_HOSTS = new Set(["design.pengshz.cn"]);

function trimTrailingSlashes(value) {
  return value.replace(/\/+$/, "");
}

export function getApiOrigin() {
  const configuredOrigin = import.meta.env.VITE_API_ORIGIN?.trim();

  if (configuredOrigin) {
    return trimTrailingSlashes(configuredOrigin);
  }

  if (typeof window === "undefined") {
    return "";
  }

  return STATIC_SITE_HOSTS.has(window.location.hostname) ? PRODUCTION_API_ORIGIN : "";
}

export function createApiUrl(pathname) {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const apiOrigin = getApiOrigin();

  return apiOrigin ? `${apiOrigin}${normalizedPath}` : normalizedPath;
}
