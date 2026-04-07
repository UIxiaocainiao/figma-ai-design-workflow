const AUTH_MODES = new Set(["login", "register"]);

export function getAuthModeFromLocation(locationLike) {
  const currentLocation = locationLike ?? window.location;
  const searchParams = new URLSearchParams(currentLocation.search);
  const mode = searchParams.get("auth");

  return AUTH_MODES.has(mode) ? mode : null;
}

export function getAuthHref(mode, locationLike) {
  const currentLocation = locationLike ?? window.location;
  const nextMode = AUTH_MODES.has(mode) ? mode : "login";

  return `${currentLocation.pathname}?auth=${nextMode}`;
}

export function getHomeHref(locationLike) {
  const currentLocation = locationLike ?? window.location;
  return currentLocation.pathname;
}

export function replaceAuthUrl(mode, locationLike) {
  window.history.replaceState(window.history.state, "", getAuthHref(mode, locationLike));
}
