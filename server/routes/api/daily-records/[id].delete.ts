import { defineHandler } from "nitro";
import { query } from "../../database/db";

export default defineHandler(async (event) => {
  try {
    const id = event.params.id;

    const recordResult = await query("SELECT * FROM daily_records WHERE id = $1", [parseInt(id)]);
    if (recordResult.rows.length === 0) {
      return { success: false, message: "Enregistrement non trouvé" };
    }

    const dailyRecord = recordResult.rows[0];

    // Check access
    const user = event.context.user;
    if (user?.role !== "SUPER_ADMIN") {
      const access = await query(
        "SELECT * FROM user_sub_site_access WHERE user_id = $1 AND sub_site_id = $2",
        [user.id, dailyRecord.sub_site_id]
      );
      if (access.rows.length === 0) {
        return { success: false, message: "Accès refusé" };
      }
    }

    await query("DELETE FROM daily_records WHERE id = $1", [parseInt(id)]);

    await query("INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES ($1, 'DELETE', 'daily_record', $2)", [user.id, parseInt(id)]);

    return { success: true, message: "Enregistrement supprimé" };
  } catch (error) {
    console.error("Delete daily record error:", error);
    return { success: false, message: "Erreur lors de la suppression" };
  }
});