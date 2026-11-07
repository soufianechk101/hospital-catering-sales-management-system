import { defineHandler } from "nitro";
import { readBody } from "nitro/h3";
import { query } from "../../database/db";

export default defineHandler(async (event) => {
  try {
    const id = event.params.id;
    const body = await readBody<{ amount?: number; effective_from?: string; effective_to?: string }>(event);

    const result = await query(
      `UPDATE prices SET amount = COALESCE($1, amount), effective_from = COALESCE($2, effective_from), effective_to = COALESCE($3, effective_to), updated_at = now() WHERE id = $4 RETURNING *`,
      [body.amount, body.effective_from, body.effective_to, parseInt(id)]
    );

    if (result.rows.length === 0) {
      return { success: false, message: "Prix non trouvé" };
    }

    await query("INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES ($1, 'UPDATE', 'price', $2)", [event.context.user.id, parseInt(id)]);

    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error("Update price error:", error);
    return { success: false, message: "Erreur lors de la mise à jour" };
  }
});