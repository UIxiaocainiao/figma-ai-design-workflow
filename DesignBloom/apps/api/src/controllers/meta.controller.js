import { sendJson } from "../utils/response.js";

export function handleMeta({ res }) {
  sendJson(res, 200, {
    product: "DesignBloom",
    frontend: {
      app: "web",
      framework: "React + Vite",
      entry: "apps/web/index.html",
    },
    backend: {
      service: "api",
      runtime: "Node.js http",
      entry: "apps/api/src/server.js",
    },
  });
}

