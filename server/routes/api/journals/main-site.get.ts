import { defineHandler } from "nitro";
import { query } from "../../database/db";

export default defineHandler(async (event) => {
  const siteId = event.query.site_id as string;
  const startDate = event.query.start_date as string;
  const endDate = event.query.end_date as string;

  if (!siteId) {
    return { success: false, message: "ID site requis" };
  }

  // Check access
  const user = event.context.user;
  if (user?.role !== "SUPER_ADMIN") {
    const access = await query(
      "SELECT * FROM user_site_access WHERE user_id = $1 AND site_id = $2",
      [user.id, parseInt(siteId)]
    );
    if (access.rows.length === 0) {
      return { success: false, message: "Accès refusé" };
    }
  }

  let sql = `
    SELECT ss.id as sub_site_id, ss.name as sub_site_name,
           COUNT(dr.id) as record_count,
           COALESCE(SUM(mq.quantity), 0) as total_meals,
           COALESCE(SUM(mq.revenue), 0) as total_revenue
    FROM sub_sites ss
    LEFT JOIN daily_records dr ON dr.sub_site_id = ss.id
    LEFT JOIN daily_service_records dsr ON dsr.daily_record_id = dr.id
    LEFT JOIN meal_quantities mq ON mq.daily_service_record_id = dsr.id
    WHERE ss.site_id = $1
  `;
  const params: any[] = [parseInt(siteId)];

  if (startDate) {
    sql += ` AND (dr.record_date >= $2 OR dr.record_date IS NULL)`;
    params.push(startDate);
  }
  if (endDate) {
    sql += ` AND (dr.record_date <= $${params.length + 1} OR dr.record_date IS NULL)`;
    params.push(endDate);
  }

  sql += ` GROUP BY ss.id, ss.name ORDER BY ss.name`;

  const result = await query(sql, params);
  return { success: true, data: result.rows };
});