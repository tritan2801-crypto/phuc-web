import crypto from 'crypto'

/**
 * Hashes a plain text password using SHA-256.
 * @param password Plain text password
 */
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

/**
 * Compares a plain text password with a hash.
 * @param password Plain text password
 * @param hash Hashed password to compare against
 */
export function comparePassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}
