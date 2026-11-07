import { defineHandler } from "nitro";
import { readBody } from "nitro/h3";
import { query } from "../../database/db";

export default defineHandler(async (event) => {
  try {
    const id = event.params.id;
    const body = await readBody<{ name?: string; code?: string; address?: string; is_active?: boolean }>(event);

    const result = await query(
      `UPDATE sub_sites SET name = COALESCE($1, name), code = COALESCE($2, code), address = COALESCE($3, address), is_active = COALESCE($4, is_active), updated_at = now() WHERE id = $5 RETURNING *`,
      [body.name, body.code, body.address, body.is_active, parseInt(id)]
    );

    if (result.rows.length === 0) {
      return { success: false, message: "Sous-site non trouvé" };
    }

    await query("INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES ($1, 'UPDATE', 'sub_site', $2)", [event.context.user.id, parseInt(id)]);

    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error("Update sub-site error:", error);
    return { success: false, message: "Erreur lors de la mise à jour" };
  }
});