import { defineHandler } from "nitro";
import { readBody } from "nitro/h3";
import { query } from "../../database/db";

export default defineHandler(async (event) => {
  try {
    const body = await readBody<{ meal_category_id: number; amount: number; effective_from: string; effective_to?: string }>(event);

    if (!body.meal_category_id || !body.amount || !body.effective_from) {
      return { success: false, message: "Catégorie, montant et date d'effet requis" };
    }

    const result = await query(
      `INSERT INTO prices (meal_category_id, amount, effective_from, effective_to) VALUES ($1, $2, $3, $4) RETURNING *`,
      [body.meal_category_id, body.amount, body.effective_from, body.effective_to || null]
    );

    await query("INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES ($1, 'CREATE', 'price', $2)", [event.context.user.id, result.rows[0].id]);

    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error("Create price error:", error);
    return { success: false, message: "Erreur lors de la création du prix" };
  }
});