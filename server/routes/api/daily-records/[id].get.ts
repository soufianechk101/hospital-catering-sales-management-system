import { defineHandler } from "nitro";
import { query } from "../../../database/db";

export default defineHandler(async (event) => {
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

  // Get service records with meal quantities
  const serviceResult = await query(
    `SELECT dsr.*, s.name as service_name, mp.name as meal_period_name
     FROM daily_service_records dsr
     INNER JOIN services s ON dsr.service_id = s.id
     INNER JOIN meal_periods mp ON dsr.meal_period_id = mp.id
     WHERE dsr.daily_record_id = $1
     ORDER BY mp.sort_order, s.name`,
    [parseInt(id)]
  );

  const serviceRecords = serviceResult.rows;
  for (const sr of serviceRecords) {
    const qtyResult = await query(
      `SELECT mq.*, mc.name as category_name, mc.code as category_code
       FROM meal_quantities mq
       INNER JOIN meal_categories mc ON mq.meal_category_id = mc.id
       WHERE mq.daily_service_record_id = $1
       ORDER BY mc.id`,
      [sr.id]
    );
    sr.quantities = qtyResult.rows;
  }

  return { success: true, data: { record: dailyRecord, services: serviceRecords } };
});