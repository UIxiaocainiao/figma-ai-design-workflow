import {
  consumeVerificationCode,
  createUser,
  createVerificationCode,
  findUserByEmail,
  findUserByUsername,
  findUserForLogin,
  getLatestVerificationCode,
  updateLastLogin,
} from "../repositories/auth.repository.js";
import { HttpError } from "../utils/httpError.js";
import { hashPassword, verifyPassword } from "../utils/password.js";

const VERIFICATION_CODE_TTL_MINUTES = 10;
const verificationCodePattern = /^\d{6}$/;
const usernamePattern = /^[a-zA-Z0-9._-]{3,24}$/;

function isValidEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidUrl(value) {
  if (!value) {
    return true;
  }

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function ensurePayloadObject(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new HttpError(400, "request payload must be a JSON object");
  }
}

function generateVerificationCode() {
  return `${Math.floor(100000 + Math.random() * 900000)}`;
}

function ensurePassword(password) {
  if (typeof password !== "string" || password.length < 8) {
    throw new HttpError(400, "password must be at least 8 characters");
  }
}

export async function sendVerificationCode(payload) {
  ensurePayloadObject(payload);
  const email = normalizeText(payload.email).toLowerCase();

  if (!isValidEmail(email)) {
    throw new HttpError(400, "email must be a valid address");
  }

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new HttpError(409, "email is already registered");
  }

  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + VERIFICATION_CODE_TTL_MINUTES * 60_000).toISOString();

  await createVerificationCode(email, code, expiresAt);

  return {
    status: "code_sent",
    message: "Verification code generated. Wire an email provider before production use.",
    devCode: code,
    expiresAt,
  };
}

export async function registerUser(payload) {
  ensurePayloadObject(payload);
  const avatarUrl = normalizeText(payload.avatarUrl);
  const nickname = normalizeText(payload.nickname);
  const username = normalizeText(payload.username);
  const email = normalizeText(payload.email).toLowerCase();
  const verificationCode = normalizeText(payload.verificationCode);
  const password = payload.password;

  if (!nickname) {
    throw new HttpError(400, "nickname is required");
  }

  if (!usernamePattern.test(username)) {
    throw new HttpError(400, "username must be 3-24 characters using letters, numbers, dot, underscore or hyphen");
  }

  if (!isValidEmail(email)) {
    throw new HttpError(400, "email must be a valid address");
  }

  if (!verificationCodePattern.test(verificationCode)) {
    throw new HttpError(400, "verification code must be 6 digits");
  }

  if (!isValidUrl(avatarUrl)) {
    throw new HttpError(400, "avatarUrl must be a valid URL");
  }

  ensurePassword(password);

  const [emailUser, usernameUser, latestCode] = await Promise.all([
    findUserByEmail(email),
    findUserByUsername(username),
    getLatestVerificationCode(email),
  ]);

  if (emailUser) {
    throw new HttpError(409, "email is already registered");
  }

  if (usernameUser) {
    throw new HttpError(409, "username is already registered");
  }

  if (!latestCode) {
    throw new HttpError(400, "verification code not found for this email");
  }

  if (latestCode.expires_at <= new Date().toISOString()) {
    throw new HttpError(400, "verification code has expired");
  }

  if (latestCode.code !== verificationCode) {
    throw new HttpError(400, "verification code is incorrect");
  }

  const { hash, salt } = hashPassword(password);
  const now = new Date().toISOString();

  const user = await createUser({
    avatarUrl,
    nickname,
    username,
    email,
    verificationCode,
    verificationSentAt: latestCode.created_at,
    verificationVerifiedAt: now,
    passwordHash: hash,
    passwordSalt: salt,
    createdAt: now,
    updatedAt: now,
  });

  await consumeVerificationCode(latestCode.id);

  return {
    status: "registered",
    message: "Account created successfully.",
    user,
  };
}

export async function loginUser(payload) {
  ensurePayloadObject(payload);
  const account = normalizeText(payload.account);
  const password = payload.password;

  if (!account) {
    throw new HttpError(400, "account is required");
  }

  ensurePassword(password);

  const user = await findUserForLogin(account);

  if (!user) {
    throw new HttpError(401, "account or password is incorrect");
  }

  const passwordMatched = verifyPassword(password, user.password_salt, user.password_hash);

  if (!passwordMatched) {
    throw new HttpError(401, "account or password is incorrect");
  }

  const loggedInUser = await updateLastLogin(user.id);

  return {
    status: "authenticated",
    message: `Welcome back, ${loggedInUser.nickname}.`,
    user: loggedInUser,
  };
}
