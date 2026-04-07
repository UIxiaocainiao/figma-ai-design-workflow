import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  closeMysqlDatabase,
  initializeMysqlDatabase,
  queryMysql,
  runMysql,
} from "./mysql.js";
import {
  closeSqliteDatabase,
  initializeSqliteDatabase,
  querySqlite,
  runSqlite,
} from "./sqlite.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const sqliteSchemaFile = path.join(currentDir, "schema.sql");
const mysqlSchemaFile = path.join(currentDir, "mysql-schema.sql");
const configuredDatabaseUrl =
  process.env.DATABASE_URL?.trim() ||
  process.env.MYSQL_URL?.trim() ||
  process.env.MYSQL_PUBLIC_URL?.trim() ||
  "";

let initialized = false;

export function getDatabaseProvider() {
  return configuredDatabaseUrl ? "mysql" : "sqlite";
}

export async function initializeDatabase() {
  if (initialized) {
    return;
  }

  if (getDatabaseProvider() === "mysql") {
    const schema = await readFile(mysqlSchemaFile, "utf8");
    await initializeMysqlDatabase(configuredDatabaseUrl, schema);
  } else {
    const schema = await readFile(sqliteSchemaFile, "utf8");
    await initializeSqliteDatabase(schema);
  }

  initialized = true;
}

export async function runSql(sql, params = []) {
  if (getDatabaseProvider() === "mysql") {
    return runMysql(sql, params);
  }

  return runSqlite(sql, params);
}

export async function querySql(sql, params = []) {
  if (getDatabaseProvider() === "mysql") {
    return queryMysql(sql, params);
  }

  return querySqlite(sql, params);
}

export async function closeDatabase() {
  if (getDatabaseProvider() === "mysql") {
    await closeMysqlDatabase();
    return;
  }

  await closeSqliteDatabase();
}
