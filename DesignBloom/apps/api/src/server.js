import http from "node:http";
import { createApp } from "./app.js";
import { env } from "./config/env.js";

const server = http.createServer(createApp());

server.listen(env.port, env.host, () => {
  console.log(`DesignBloom API listening on http://${env.host}:${env.port}`);
});

function shutdown(signal) {
  console.log(`Received ${signal}, shutting down DesignBloom API...`);

  server.close((error) => {
    if (error) {
      console.error("Failed to close server cleanly:", error);
      process.exit(1);
      return;
    }

    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

