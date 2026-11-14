import { defineHandler } from "nitro";
import { query } from "../../../database/db";

export default defineHandler(async (event) => {
  const id = event.params.id;
  const user = event.context.user;

  const result = await query("SELECT * FROM sites WHERE id = $1", [parseInt(id)]);

  if (result.rows.length === 0) {
    return { success: false, message: "Site non trouvé" };
  }

  const site = result.rows[0];

  // Check access for non-super-admin
  if (user?.role !== "SUPER_ADMIN") {
    const access = await query(
      "SELECT * FROM user_site_access WHERE user_id = $1 AND site_id = $2",
      [user.id, parseInt(id)]
    );
    if (access.rows.length === 0) {
      return { success: false, message: "Accès refusé" };
    }
  }

  return { success: true, data: site };
});