import { defineHandler } from "nitro";
import { query } from "../../database/db";

export default defineHandler(async () => {
  const result = await query("SELECT * FROM meal_categories WHERE is_active = true ORDER BY id");
  return { success: true, data: result.rows };
});