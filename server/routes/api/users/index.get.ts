import { defineHandler } from "nitro";
import { query } from "../../../database/db";

export default defineHandler(async (event) => {
  const user = event.context.user;

  if (user?.role !== "SUPER_ADMIN") {
    return { success: false, message: "Accès refusé" };
  }

  const result = await query("SELECT id, username, email, full_name, role, is_active, created_at FROM users ORDER BY id");
  return { success: true, data: result.rows };
});