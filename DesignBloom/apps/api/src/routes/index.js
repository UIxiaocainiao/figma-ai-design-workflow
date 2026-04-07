import {
  handleLogin,
  handleRegister,
  handleSendVerificationCode,
} from "../controllers/auth.controller.js";
import { handleContact } from "../controllers/contact.controller.js";
import { handleHealth } from "../controllers/health.controller.js";
import { handleMeta } from "../controllers/meta.controller.js";
import { handleMusic } from "../controllers/music.controller.js";

const routes = new Map([
  ["GET /health", handleHealth],
  ["GET /api/health", handleHealth],
  ["GET /api/meta", handleMeta],
  ["GET /api/music", handleMusic],
  ["POST /api/auth/send-code", handleSendVerificationCode],
  ["POST /api/auth/register", handleRegister],
  ["POST /api/auth/login", handleLogin],
  ["POST /api/contact", handleContact],
]);

export function resolveRoute(method, pathname) {
  return routes.get(`${method} ${pathname}`);
}
