import { querySql, runSql } from "../db/index.js";

function mapUser(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    avatarUrl: row.avatar_url ?? "",
    nickname: row.nickname,
    username: row.username,
    email: row.email,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastLoginAt: row.last_login_at,
  };
}

async function findUserById(id) {
  const rows = await querySql(
    `
    SELECT *
    FROM users
    WHERE id = ?
    LIMIT 1;
  `,
    [id],
  );

  return rows[0] ?? null;
}

export async function findUserByEmail(email) {
  const rows = await querySql(
    `
    SELECT *
    FROM users
    WHERE email = ?
    LIMIT 1;
  `,
    [email],
  );

  return rows[0] ?? null;
}

export async function findUserByUsername(username) {
  const rows = await querySql(
    `
    SELECT *
    FROM users
    WHERE username = ?
    LIMIT 1;
  `,
    [username],
  );

  return rows[0] ?? null;
}

export async function findUserForLogin(account) {
  const rows = await querySql(
    `
    SELECT *
    FROM users
    WHERE username = ?
      OR email = ?
    LIMIT 1;
  `,
    [account, account],
  );

  return rows[0] ?? null;
}

export async function createVerificationCode(email, code, expiresAt) {
  const createdAt = new Date().toISOString();

  await runSql(
    `
    UPDATE verification_codes
    SET status = 'superseded'
    WHERE email = ?
      AND status = 'pending';
  `,
    [email],
  );

  await runSql(
    `
    INSERT INTO verification_codes (
      email,
      code,
      status,
      created_at,
      expires_at
    ) VALUES (
      ?,
      ?,
      'pending',
      ?,
      ?
    );
  `,
    [email, code, createdAt, expiresAt],
  );
}

export async function getLatestVerificationCode(email) {
  const rows = await querySql(
    `
    SELECT *
    FROM verification_codes
    WHERE email = ?
      AND status = 'pending'
    ORDER BY id DESC
    LIMIT 1;
  `,
    [email],
  );

  return rows[0] ?? null;
}

export async function consumeVerificationCode(id) {
  const consumedAt = new Date().toISOString();

  await runSql(
    `
    UPDATE verification_codes
    SET status = 'consumed',
        consumed_at = ?
    WHERE id = ?;
  `,
    [consumedAt, id],
  );
}

export async function createUser(userInput) {
  await runSql(
    `
    INSERT INTO users (
      avatar_url,
      nickname,
      username,
      email,
      verification_code,
      verification_sent_at,
      verification_verified_at,
      password_hash,
      password_salt,
      created_at,
      updated_at
    ) VALUES (
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?
    );
  `,
    [
      userInput.avatarUrl,
      userInput.nickname,
      userInput.username,
      userInput.email,
      userInput.verificationCode,
      userInput.verificationSentAt,
      userInput.verificationVerifiedAt,
      userInput.passwordHash,
      userInput.passwordSalt,
      userInput.createdAt,
      userInput.updatedAt,
    ],
  );

  return mapUser(await findUserByEmail(userInput.email));
}

export async function updateLastLogin(userId) {
  const now = new Date().toISOString();

  await runSql(
    `
    UPDATE users
    SET last_login_at = ?,
        updated_at = ?
    WHERE id = ?;
  `,
    [now, now, userId],
  );

  return mapUser(await findUserById(userId));
}
