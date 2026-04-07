import mysql from "mysql2/promise";

let pool;

function splitSqlStatements(sql) {
  return sql
    .split(/;\s*(?:\r?\n|$)/)
    .map((statement) => statement.trim())
    .filter(Boolean);
}

function createPoolFromUrl(databaseUrl) {
  const url = new URL(databaseUrl);

  return mysql.createPool({
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ""),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    multipleStatements: false,
  });
}

async function getPool() {
  if (!pool) {
    throw new Error("MySQL pool has not been initialized");
  }

  return pool;
}

export async function initializeMysqlDatabase(databaseUrl, schema) {
  if (!pool) {
    pool = createPoolFromUrl(databaseUrl);
  }

  for (const statement of splitSqlStatements(schema)) {
    await pool.query(statement);
  }
}

export async function runMysql(sql, params = []) {
  const connectionPool = await getPool();
  const [result] = await connectionPool.query(sql, params);
  return result;
}

export async function queryMysql(sql, params = []) {
  const connectionPool = await getPool();
  const [rows] = await connectionPool.query(sql, params);
  return rows;
}

export async function closeMysqlDatabase() {
  if (!pool) {
    return;
  }

  await pool.end();
  pool = undefined;
}
