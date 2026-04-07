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
const configuredDatabaseUrl =
  process.env.DATABASE_URL?.trim() ||
  process.env.MYSQL_URL?.trim() ||
  process.env.MYSQL_PUBLIC_URL?.trim() ||
  "";

let initialized = false;

function getRequiredDatabaseUrl() {
  if (!configuredDatabaseUrl) {
    throw new Error(
      "DATABASE_URL is required. SQLite fallback has been removed and the API now requires MySQL.",
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
