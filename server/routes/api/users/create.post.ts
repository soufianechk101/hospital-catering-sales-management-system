import { defineHandler } from "nitro";
import { readBody } from "nitro/h3";
import { query } from "../../../database/db";
import bcrypt from "bcryptjs";

export default defineHandler(async (event) => {
  try {
    const body = await readBody<{ username: string; email: string; password: string; full_name: string; role: string }>(event);

    if (!body.username || !body.email || !body.password || !body.full_name || !body.role) {
      return { success: false, message: "Tous les champs sont requis" };
    }

    const passwordHash = await bcrypt.hash(body.password, 10);
    const result = await query(
      `INSERT INTO users (username, email, password_hash, full_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [body.username, body.email, passwordHash, body.full_name, body.role]
    );

    await query("INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES ($1, 'CREATE', 'user', $2)", [event.context.user.id, result.rows[0].id]);

    return { success: true, data: { id: result.rows[0].id } };
  } catch (error) {
    console.error("Create user error:", error);
    return { success: false, message: "Erreur lors de la création de l'utilisateur" };
  }
});