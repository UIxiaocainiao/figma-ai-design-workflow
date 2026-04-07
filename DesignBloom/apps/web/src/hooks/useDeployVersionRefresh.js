import { useEffect } from "react";

const BUILD_META_SELECTOR = 'meta[name="x-build-id"]';
const REFRESH_PARAM = "__deploy";
const REFRESH_STORAGE_KEY = "designbloom-last-refresh-build-id";
const VERSION_ENDPOINT = "/version.json";
const VERSION_CHECK_INTERVAL_MS = 60_000;

function getCurrentBuildId() {
  return document.querySelector(BUILD_META_SELECTOR)?.getAttribute("content")?.trim() ?? "";
}

async function fetchLatestBuildId() {
  const response = await fetch(`${VERSION_ENDPOINT}?t=${Date.now()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${VERSION_ENDPOINT}: ${response.status}`);
  }

  const payload = await response.json();
  return typeof payload?.buildId === "string" ? payload.buildId.trim() : "";
}

function clearRefreshParamIfSynced(currentBuildId) {
  const url = new URL(window.location.href);

  if (url.searchParams.get(REFRESH_PARAM) !== currentBuildId) {
    return;
  }

  url.searchParams.delete(REFRESH_PARAM);
  window.history.replaceState(window.history.state, "", url.toString());
  sessionStorage.removeItem(REFRESH_STORAGE_KEY);
}

function reloadToLatestBuild(nextBuildId) {
  const url = new URL(window.location.href);
  url.searchParams.set(REFRESH_PARAM, nextBuildId);
  sessionStorage.setItem(REFRESH_STORAGE_KEY, nextBuildId);
  window.location.replace(url.toString());
}

export function useDeployVersionRefresh() {
  useEffect(() => {
    if (import.meta.env.DEV) {
      return undefined;
    }

    const currentBuildId = getCurrentBuildId();

    if (!currentBuildId) {
      return undefined;
    }

    clearRefreshParamIfSynced(currentBuildId);

    let disposed = false;

    const checkForNewBuild = async () => {
      if (disposed || document.visibilityState === "hidden") {
        return;
      }

      try {
        const latestBuildId = await fetchLatestBuildId();

        if (!latestBuildId || latestBuildId === currentBuildId) {
          return;
        }

        const url = new URL(window.location.href);
        const lastReloadedBuildId = sessionStorage.getItem(REFRESH_STORAGE_KEY);

        if (
          lastReloadedBuildId === latestBuildId &&
          url.searchParams.get(REFRESH_PARAM) === latestBuildId
        ) {
          return;
        }

        reloadToLatestBuild(latestBuildId);
      } catch (error) {
        console.warn("Version check skipped:", error);
      }
    };

    void checkForNewBuild();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void checkForNewBuild();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void checkForNewBuild();
      }
    }, VERSION_CHECK_INTERVAL_MS);

    return () => {
      disposed = true;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.clearInterval(intervalId);
    };
  }, []);
}
