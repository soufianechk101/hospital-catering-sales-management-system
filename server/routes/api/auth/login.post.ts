import { defineHandler } from "nitro";
import { readBody } from "nitro/h3";
import { query } from "../../database/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "medicatering-secret-key-change-in-production";

export default defineHandler(async (event) => {
  try {
    const body = await readBody<{ username: string; password: string }>(event);

    if (!body.username || !body.password) {
      return { success: false, message: "Nom d'utilisateur et mot de passe requis" };
    }

    const result = await query("SELECT * FROM users WHERE username = $1 AND is_active = true", [body.username]);

    if (result.rows.length === 0) {
      return { success: false, message: "Identifiants invalides" };
    }

    const user = result.rows[0];

    const isValid = await bcrypt.compare(body.password, user.password_hash);
    if (!isValid) {
      return { success: false, message: "Identifiants invalides" };
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return {
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Erreur serveur" };
  }
});