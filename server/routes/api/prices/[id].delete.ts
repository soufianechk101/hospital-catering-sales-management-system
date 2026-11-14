import { defineHandler } from "nitro";
import { query } from "../../../database/db";

export default defineHandler(async (event) => {
  try {
    const id = event.params.id;

    const result = await query("DELETE FROM prices WHERE id = $1 RETURNING id", [parseInt(id)]);

    if (result.rows.length === 0) {
      return { success: false, message: "Prix non trouvé" };
    }

    await query("INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES ($1, 'DELETE', 'price', $2)", [event.context.user.id, parseInt(id)]);

    return { success: true, message: "Prix supprimé" };
  } catch (error) {
    console.error("Delete price error:", error);
    return { success: false, message: "Erreur lors de la suppression" };
  }
});