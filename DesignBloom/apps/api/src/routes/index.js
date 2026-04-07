import { handleContact } from "../controllers/contact.controller.js";
import { handleHealth } from "../controllers/health.controller.js";
import { handleMeta } from "../controllers/meta.controller.js";

const routes = new Map([
  ["GET /health", handleHealth],
  ["GET /api/health", handleHealth],
  ["GET /api/meta", handleMeta],
  ["POST /api/contact", handleContact],
]);

export function resolveRoute(method, pathname) {
  return routes.get(`${method} ${pathname}`);
}

