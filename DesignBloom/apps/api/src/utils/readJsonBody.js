import { HttpError } from "./httpError.js";

export function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let rawBody = "";
    let settled = false;

    function rejectOnce(error) {
      if (settled) {
        return;
      }

      settled = true;
      reject(error);
    }

    function resolveOnce(payload) {
      if (settled) {
        return;
      }

      settled = true;
      resolve(payload);
    }

    req.on("data", (chunk) => {
      rawBody += chunk;

      if (rawBody.length > 1_000_000) {
        rejectOnce(new HttpError(413, "request body too large"));
        req.destroy();
      }
    });

    req.on("end", () => {
      if (!rawBody) {
        resolveOnce({});
        return;
      }

      try {
        const parsedBody = JSON.parse(rawBody);

        if (parsedBody === null || Array.isArray(parsedBody) || typeof parsedBody !== "object") {
          rejectOnce(new HttpError(400, "JSON payload must be an object"));
          return;
        }

        resolveOnce(parsedBody);
      } catch {
        rejectOnce(new HttpError(400, "invalid JSON payload"));
      }
    });

    req.on("error", rejectOnce);
  });
}
