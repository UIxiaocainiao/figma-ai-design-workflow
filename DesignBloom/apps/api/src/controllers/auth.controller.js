import { readJsonBody } from "../utils/readJsonBody.js";
import { sendJson } from "../utils/response.js";
import { HttpError } from "../utils/httpError.js";
import { loginUser, registerUser, sendVerificationCode } from "../services/auth.service.js";

function sendError(res, error) {
  if (error instanceof HttpError) {
    sendJson(res, error.statusCode, {
      status: "error",
      message: error.message,
      errors: error.details.length > 0 ? error.details : undefined,
    });
    return true;
  }

  return false;
}

export async function handleSendVerificationCode({ req, res }) {
  try {
    const payload = await readJsonBody(req);
    const result = await sendVerificationCode(payload);
    sendJson(res, 200, result);
  } catch (error) {
    if (!sendError(res, error)) {
      throw error;
    }
  }
}

export async function handleRegister({ req, res }) {
  try {
    const payload = await readJsonBody(req);
    const result = await registerUser(payload);
    sendJson(res, 201, result);
  } catch (error) {
    if (!sendError(res, error)) {
      throw error;
    }
  }
}

export async function handleLogin({ req, res }) {
  try {
    const payload = await readJsonBody(req);
    const result = await loginUser(payload);
    sendJson(res, 200, result);
  } catch (error) {
    if (!sendError(res, error)) {
      throw error;
    }
  }
}
