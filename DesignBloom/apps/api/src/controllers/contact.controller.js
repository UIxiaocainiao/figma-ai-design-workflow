import { readJsonBody } from "../utils/readJsonBody.js";
import { sendJson } from "../utils/response.js";

function isValidEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function handleContact({ req, res }) {
  const payload = await readJsonBody(req);
  const errors = [];

  if (!payload.name || typeof payload.name !== "string") {
    errors.push("name is required");
  }

  if (!isValidEmail(payload.email)) {
    errors.push("email must be a valid address");
  }

  if (!payload.scope || typeof payload.scope !== "string") {
    errors.push("scope is required");
  }

  if (!payload.message || typeof payload.message !== "string") {
    errors.push("message is required");
  }

  if (errors.length > 0) {
    sendJson(res, 400, {
      status: "error",
      errors,
    });
    return;
  }

  sendJson(res, 201, {
    status: "accepted",
    message: "Inquiry captured. Attach a database or email worker before production use.",
    inquiry: {
      name: payload.name.trim(),
      email: payload.email.trim(),
      scope: payload.scope.trim(),
      message: payload.message.trim(),
      receivedAt: new Date().toISOString(),
    },
  });
}

