const defaultPort = 3001;
const parsedPort = Number.parseInt(process.env.PORT ?? `${defaultPort}`, 10);

export const env = Object.freeze({
  host: process.env.HOST ?? "0.0.0.0",
  port: Number.isNaN(parsedPort) ? defaultPort : parsedPort,
  corsOrigin: process.env.CORS_ORIGIN ?? "*",
});

