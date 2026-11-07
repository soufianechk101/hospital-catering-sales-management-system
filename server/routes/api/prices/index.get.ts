import { defineHandler } from "nitro";
import { query } from "../../database/db";

export default defineHandler(async (event) => {
  const date = event.query.date as string || new Date().toISOString().split('T')[0];

  const result = await query(
    `SELECT p.*, mc.name as category_name, mc.code as category_code
     FROM prices p
     INNER JOIN meal_categories mc ON p.meal_category_id = mc.id
     WHERE p.effective_from <= $1 AND (p.effective_to IS NULL OR p.effective_to >= $1)
     ORDER BY mc.id`,
    [date]
  );

  return { success: true, data: result.rows };
});