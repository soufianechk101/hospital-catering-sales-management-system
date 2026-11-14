import { defineHandler } from "nitro";
import { readBody } from "nitro/h3";
import { query } from "../../../database/db";

export default defineHandler(async (event) => {
  try {
    const id = event.params.id;
    const body = await readBody<{
      services: Array<{
        service_id: number;
        meal_period_id: number;
        passage_global: number;
        quantities: Array<{ meal_category_id: number; quantity: number }>;
      }>;
    }>(event);

    // Get existing record
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

    // Validate quantities
    for (const service of body.services) {
      const totalQuantity = service.quantities.reduce((sum, q) => sum + q.quantity, 0);
      if (totalQuantity > service.passage_global) {
        return { success: false, message: `Quantité totale dépasse le passage global pour le service ID ${service.service_id}` };
      }
    }

    // Get current prices
    const pricesResult = await query(
      `SELECT meal_category_id, amount FROM prices WHERE effective_from <= $1 AND (effective_to IS NULL OR effective_to >= $1)`,
      [dailyRecord.record_date]
    );
    const prices: Record<number, number> = {};
    pricesResult.rows.forEach(p => prices[p.meal_category_id] = parseFloat(p.amount));

    // Update daily record
    await query("UPDATE daily_records SET updated_by = $1, updated_at = now() WHERE id = $2", [user.id, parseInt(id)]);

    // Update service records
    for (const service of body.services) {
      const existingResult = await query(
        "SELECT id FROM daily_service_records WHERE daily_record_id = $1 AND service_id = $2 AND meal_period_id = $3",
        [parseInt(id), service.service_id, service.meal_period_id]
      );

      let serviceRecordId;
      if (existingResult.rows.length > 0) {
        serviceRecordId = existingResult.rows[0].id;
        await query(
          "UPDATE daily_service_records SET passage_global = $1, updated_at = now() WHERE id = $2",
          [service.passage_global, serviceRecordId]
        );
      } else {
        const newResult = await query(
          "INSERT INTO daily_service_records (daily_record_id, service_id, meal_period_id, passage_global) VALUES ($1, $2, $3, $4) RETURNING id",
          [parseInt(id), service.service_id, service.meal_period_id, service.passage_global]
        );
        serviceRecordId = newResult.rows[0].id;
      }

      // Update quantities
      await query("DELETE FROM meal_quantities WHERE daily_service_record_id = $1", [serviceRecordId]);
      for (const qty of service.quantities) {
        const unitPrice = prices[qty.meal_category_id] || 0;
        const revenue = qty.quantity * unitPrice;
        await query(
          "INSERT INTO meal_quantities (daily_service_record_id, meal_category_id, quantity, unit_price, revenue) VALUES ($1, $2, $3, $4, $5)",
          [serviceRecordId, qty.meal_category_id, qty.quantity, unitPrice, revenue]
        );
      }
    }

    await query("INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES ($1, 'UPDATE', 'daily_record', $2)", [user.id, parseInt(id)]);

    return { success: true, message: "Enregistrement mis à jour" };
  } catch (error) {
    console.error("Update daily record error:", error);
    return { success: false, message: "Erreur lors de la mise à jour" };
  }
});