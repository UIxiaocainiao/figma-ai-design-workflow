import http from "node:http";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { closeDatabase, getDatabaseProvider, initializeDatabase } from "./db/index.js";
import { syncMusicLibrary } from "./services/music.service.js";

await initializeDatabase();
const syncedTracks = await syncMusicLibrary();

const server = http.createServer(createApp());

server.listen(env.port, env.host, () => {
  console.log(`Music library ready with ${syncedTracks.length} track(s) in ${getDatabaseProvider()}.`);
  console.log(
    `DesignBloom API listening on http://${env.host}:${env.port} using ${getDatabaseProvider()}`,
  );
});

function shutdown(signal) {
  console.log(`Received ${signal}, shutting down DesignBloom API...`);

  server.close((error) => {
    void (async () => {
      if (error) {
        console.error("Failed to close server cleanly:", error);
        process.exit(1);
        return;
      }

      try {
        await closeDatabase();
        process.exit(0);
      } catch (closeError) {
        console.error("Failed to close database cleanly:", closeError);
        process.exit(1);
      }
    })();
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
