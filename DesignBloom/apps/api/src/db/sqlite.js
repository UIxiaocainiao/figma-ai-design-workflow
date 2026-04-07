import { execFile } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(currentDir, "../../data");
const databaseFile = path.join(dataDir, "designbloom.sqlite");
const SQLITE_BUSY_TIMEOUT_MS = 5000;

export function sqlValue(value) {
  if (value === null || value === undefined) {
    return "NULL";
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? `${value}` : "NULL";
  }

  if (typeof value === "boolean") {
    return value ? "1" : "0";
  }

  return `'${String(value).replace(/'/g, "''")}'`;
}

function bindSqlParams(sql, params) {
  let paramIndex = 0;
  const boundSql = sql.replace(/\?/g, () => {
    if (paramIndex >= params.length) {
      throw new Error("Missing SQL parameter");
    }

    const value = sqlValue(params[paramIndex]);
    paramIndex += 1;
    return value;
  });

  if (paramIndex !== params.length) {
    throw new Error("Too many SQL parameters");
  }

  return boundSql;
}

async function executeSql(sql, params = [], { json = false } = {}) {
  const args = ["-cmd", `.timeout ${SQLITE_BUSY_TIMEOUT_MS}`];
  const boundSql = bindSqlParams(sql, params);

  if (json) {
    args.push("-json");
  }

  args.push(databaseFile, boundSql);

  const { stdout } = await execFileAsync("sqlite3", args, {
    maxBuffer: 1024 * 1024,
  });

  return stdout.trim();
}

export async function initializeSqliteDatabase(schema) {
  await mkdir(dataDir, { recursive: true });
  await executeSql(
    `
    PRAGMA journal_mode = WAL;
    PRAGMA busy_timeout = ${SQLITE_BUSY_TIMEOUT_MS};
    ${schema}
  `,
  );
}

export async function runSqlite(sql, params = []) {
  await executeSql(sql, params);
}

export async function querySqlite(sql, params = []) {
  const raw = await executeSql(sql, params, { json: true });

  if (!raw) {
    return [];
  }

  return JSON.parse(raw);
}

export async function closeSqliteDatabase() {}
