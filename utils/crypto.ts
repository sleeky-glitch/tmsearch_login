// A simple utility for password encryption/decryption
// In a real application, you would use a proper hashing library like bcrypt

/**
 * Encrypts a password using a simple algorithm
 * Note: This is NOT secure for production use
 */
export function encryptPassword(password: string): string {
  // For demo purposes, we'll use a simple base64 encoding with a salt
  // In production, use a proper hashing algorithm with salt
  const salt = "trademark-portal-salt"
  return btoa(`${salt}:${password}`)
}

/**
 * Decrypts a password (for demo purposes only)
 * In a real app, you would never decrypt passwords
 */
export function decryptPassword(encryptedPassword: string): string {
  try {
    const decoded = atob(encryptedPassword)
    const salt = "trademark-portal-salt"
    if (decoded.startsWith(`${salt}:`)) {
      return decoded.substring(salt.length + 1)
    }
    return "********" // Return masked if not properly formatted
  } catch (e) {
    return "********" // Return masked on error
  }
}

/**
 * Returns a masked password for display
 */
export function maskPassword(password: string): string {
  if (!password) return ""
  // Show first and last character, mask the rest
  if (password.length <= 2) return "********"
  return `${password.charAt(0)}${"*".repeat(6)}${password.charAt(password.length - 1)}`
}
