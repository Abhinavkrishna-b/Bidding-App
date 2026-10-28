import { randomBytes, scrypt as nodeScrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(nodeScrypt);
const KEY_LENGTH = 64;

export function normalizeEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    const error = new Error(
      "Set JWT_SECRET to a random value of at least 32 characters."
    );
    error.statusCode = 503;
    throw error;
  }
  return secret;
}

export async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = await scrypt(password, salt, KEY_LENGTH, {
    N: 16_384,
    r: 8,
    p: 1,
    maxmem: 64 * 1024 * 1024,
  });

  return `scrypt$16384$8$1$${salt}$${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password, encodedHash) {
  const [algorithm, cost, blockSize, parallelization, salt, keyHex] =
    typeof encodedHash === "string" ? encodedHash.split("$") : [];

  if (
    algorithm !== "scrypt" ||
    cost !== "16384" ||
    blockSize !== "8" ||
    parallelization !== "1" ||
    !salt ||
    !/^[a-f\d]+$/i.test(keyHex || "") ||
    keyHex.length !== KEY_LENGTH * 2
  ) {
    return false;
  }

  const expectedKey = Buffer.from(keyHex, "hex");
  const actualKey = await scrypt(password, salt, KEY_LENGTH, {
    N: Number(cost),
    r: Number(blockSize),
    p: Number(parallelization),
    maxmem: 64 * 1024 * 1024,
  });

  return timingSafeEqual(expectedKey, actualKey);
}
