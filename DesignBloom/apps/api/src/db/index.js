import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  closeMysqlDatabase,
  initializeMysqlDatabase,
  queryMysql,
  runMysql,
} from "./mysql.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const mysqlSchemaFile = path.join(currentDir, "mysql-schema.sql");

function getConfiguredDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL?.trim() || "";
  const mysqlUrl = process.env.MYSQL_URL?.trim() || "";
  const mysqlPublicUrl = process.env.MYSQL_PUBLIC_URL?.trim() || "";

  // `railway run` inherits service variables locally but does not run inside a deployment.
  // In that case, prefer the public MySQL URL so local development avoids `.railway.internal`.
  if (!process.env.RAILWAY_DEPLOYMENT_ID) {
    return mysqlPublicUrl || databaseUrl || mysqlUrl;
  }

  return databaseUrl || mysqlUrl || mysqlPublicUrl;
}

let initialized = false;

function getRequiredDatabaseUrl() {
  const configuredDatabaseUrl = getConfiguredDatabaseUrl();

  if (!configuredDatabaseUrl) {
    throw new Error(
      "A MySQL connection URL is required. Use MYSQL_PUBLIC_URL for local development or DATABASE_URL in Railway deployments.",
    );
  }

  return configuredDatabaseUrl;
}

export function getDatabaseProvider() {
  return "mysql";
}

export async function initializeDatabase() {
  if (initialized) {
    return;
  }

  const schema = await readFile(mysqlSchemaFile, "utf8");
  await initializeMysqlDatabase(getRequiredDatabaseUrl(), schema);

  initialized = true;
}

export async function runSql(sql, params = []) {
  return runMysql(sql, params);
}

export async function querySql(sql, params = []) {
  return queryMysql(sql, params);
}

export async function closeDatabase() {
  await closeMysqlDatabase();
}
