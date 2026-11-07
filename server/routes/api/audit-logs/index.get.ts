import { defineHandler } from "nitro";
import { query } from "../../database/db";

export default defineHandler(async (event) => {
  const user = event.context.user;

  if (user?.role !== "SUPER_ADMIN") {
    return { success: false, message: "Accès refusé" };
  }

  const result = await query("SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100");
  return { success: true, data: result.rows };
});