import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import pool from "./database"

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = Number.parseInt(process.env.BCRYPT_ROUNDS || "12")
  return bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function generateJWT(userId: number): Promise<string> {
  return jwt.sign({ userId, timestamp: Date.now() }, process.env.JWT_SECRET!, { expiresIn: "24h" })
}

export async function verifyJWT(token: string): Promise<any> {
  return jwt.verify(token, process.env.JWT_SECRET!)
}

export async function createUser(userData: any) {
  const hashedPassword = await hashPassword(userData.password)

  const [result] = await pool.execute(
    `INSERT INTO users (name, email, password_hash, age, organization, job_role, sex, location) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userData.name,
      userData.email,
      hashedPassword,
      userData.age,
      userData.organization,
      userData.jobRole,
      userData.sex,
      userData.location,
    ],
  )

  return result
}

export async function findUserByEmail(email: string) {
  const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email])

  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null
}

export async function updateLastLogin(userId: number) {
  await pool.execute("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?", [userId])
}
