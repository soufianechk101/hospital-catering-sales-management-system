import { defineHandler } from "nitro";
import { query } from "../../database/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "medicatering-secret-key-change-in-production";

export default defineHandler(async (event) => {
  try {
    const authHeader = event.node.req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { success: false, message: "Token manquant" };
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    const result = await query("SELECT id, username, email, full_name, role, is_active FROM users WHERE id = $1", [decoded.userId]);

    if (result.rows.length === 0) {
      return { success: false, message: "Utilisateur non trouvé" };
    }

    return { success: true, user: result.rows[0] };
  } catch (error) {
    return { success: false, message: "Token invalide" };
  }
});