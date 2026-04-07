import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");

  return {
    salt,
    hash,
  };
}

export function verifyPassword(password, salt, expectedHash) {
  const derivedHash = scryptSync(password, salt, 64);
  const storedHash = Buffer.from(expectedHash, "hex");

  if (derivedHash.length !== storedHash.length) {
    return false;
  }

  return timingSafeEqual(derivedHash, storedHash);
}
