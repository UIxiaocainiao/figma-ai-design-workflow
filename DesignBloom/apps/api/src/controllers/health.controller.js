import { sendJson } from "../utils/response.js";

export function handleHealth({ res }) {
  sendJson(res, 200, {
    status: "ok",
    service: "designbloom-api",
    timestamp: new Date().toISOString(),
  });
}

