import { resolveRoute } from "./routes/index.js";
import { sendJson } from "./utils/response.js";
import { env } from "./config/env.js";
import { HttpError } from "./utils/httpError.js";

export function createApp() {
  return async function app(req, res) {
    res.setHeader("Access-Control-Allow-Origin", env.corsOrigin);
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    const requestMethod = req.method ?? "GET";
    const routeMethod = requestMethod === "HEAD" ? "GET" : requestMethod;
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
    const handler = resolveRoute(routeMethod, url.pathname);

    if (!handler) {
      sendJson(res, 404, {
        status: "not_found",
        path: url.pathname,
      });
      return;
    }

    try {
      await handler({ req, res, url });
    } catch (error) {
      if (error instanceof HttpError) {
        sendJson(res, error.statusCode, {
          status: "error",
          message: error.message,
          errors: error.details.length > 0 ? error.details : undefined,
        });
        return;
      }

      sendJson(res, 500, {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown server error",
      });
    }
  };
}
