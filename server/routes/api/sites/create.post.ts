import { defineHandler } from "nitro";
import { readBody } from "nitro/h3";
import { query } from "../../../database/db";

export default defineHandler(async (event) => {
  try {
    const body = await readBody<{ company_id: number; name: string; code: string; city: string; address?: string }>(event);

    if (!body.name || !body.code || !body.city) {
      return { success: false, message: "Nom, code et ville requis" };
    }

    const result = await query(
      `INSERT INTO sites (company_id, name, code, city, address) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [body.company_id, body.name, body.code, body.city, body.address || null]
    );

    await query("INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES ($1, 'CREATE', 'site', $2)", [event.context.user.id, result.rows[0].id]);

    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error("Create site error:", error);
    return { success: false, message: "Erreur lors de la création du site" };
  }
});