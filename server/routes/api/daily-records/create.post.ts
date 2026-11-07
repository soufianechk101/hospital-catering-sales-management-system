import { defineHandler } from "nitro";
import { readBody } from "nitro/h3";
import { query } from "../../database/db";

export default defineHandler(async (event) => {
  try {
    const body = await readBody<{
      sub_site_id: number;
      record_date: string;
      services: Array<{
        service_id: number;
        meal_period_id: number;
        passage_global: number;
        quantities: Array<{ meal_category_id: number; quantity: number }>;
      }>;
    }>(event);

    if (!body.sub_site_id || !body.record_date || !body.services || body.services.length === 0) {
      return { success: false, message: "Données requises manquantes" };
    }

    // Check access
    const user = event.context.user;
    if (user?.role !== "SUPER_ADMIN") {
      const access = await query(
        "SELECT * FROM user_sub_site_access WHERE user_id = $1 AND sub_site_id = $2",
        [user.id, body.sub_site_id]
      );
      if (access.rows.length === 0) {
        return { success: false, message: "Accès refusé à ce sous-site" };
      }
    }

    // Validate quantities against passage global
    for (const service of body.services) {
      const totalQuantity = service.quantities.reduce((sum, q) => sum + q.quantity, 0);
      if (totalQuantity > service.passage_global) {
        return { success: false, message: `Quantité totale dépasse le passage global pour le service ID ${service.service_id}` };
      }
    }

    // Get current prices
    const pricesResult = await query(
      `SELECT meal_category_id, amount FROM prices WHERE effective_from <= $1 AND (effective_to IS NULL OR effective_to >= $1)`,
      [body.record_date]
    );
    const prices: Record<number, number> = {};
    pricesResult.rows.forEach(p => prices[p.meal_category_id] = parseFloat(p.amount));

    // Create daily record
    const recordResult = await query(
      `INSERT INTO daily_records (sub_site_id, record_date, created_by) VALUES ($1, $2, $3) RETURNING *`,
      [body.sub_site_id, body.record_date, user.id]
    );
    const dailyRecordId = recordResult.rows[0].id;

    // Create service records and meal quantities
    for (const service of body.services) {
      const serviceResult = await query(
        `INSERT INTO daily_service_records (daily_record_id, service_id, meal_period_id, passage_global) VALUES ($1, $2, $3, $4) RETURNING *`,
        [dailyRecordId, service.service_id, service.meal_period_id, service.passage_global]
      );
      const serviceRecordId = serviceResult.rows[0].id;

      for (const qty of service.quantities) {
        const unitPrice = prices[qty.meal_category_id] || 0;
        const revenue = qty.quantity * unitPrice;
        await query(
          `INSERT INTO meal_quantities (daily_service_record_id, meal_category_id, quantity, unit_price, revenue) VALUES ($1, $2, $3, $4, $5)`,
          [serviceRecordId, qty.meal_category_id, qty.quantity, unitPrice, revenue]
        );
      }
    }

    await query("INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES ($1, 'CREATE', 'daily_record', $2)", [user.id, dailyRecordId]);

    return { success: true, data: { id: dailyRecordId } };
  } catch (error) {
    console.error("Create daily record error:", error);
    return { success: false, message: "Erreur lors de la création de l'enregistrement" };
  }
});