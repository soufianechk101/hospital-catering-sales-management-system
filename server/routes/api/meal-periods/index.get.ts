import { defineHandler } from "nitro";
import { query } from "../../database/db";

export default defineHandler(async () => {
  const result = await query("SELECT * FROM meal_periods ORDER BY sort_order");
  return { success: true, data: result.rows };
});