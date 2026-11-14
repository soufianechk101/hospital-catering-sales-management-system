import { defineHandler } from "nitro";
import { query } from "../../../database/db";

export default defineHandler(async (event) => {
  const user = event.context.user;
  const startDate = event.query.start_date as string;
  const endDate = event.query.end_date as string;

  if (user?.role !== "SUPER_ADMIN" && user?.role !== "SITE_MANAGER") {
    return { success: false, message: "Accès refusé" };
  }

  let sql = `
    SELECT s.id as site_id, s.name as site_name,
           ss.id as sub_site_id, ss.name as sub_site_name,
           COUNT(dr.id) as record_count,
           COALESCE(SUM(mq.quantity), 0) as total_meals,
           COALESCE(SUM(mq.revenue), 0) as total_revenue
    FROM sites s
    LEFT JOIN sub_sites ss ON ss.site_id = s.id
    LEFT JOIN daily_records dr ON dr.sub_site_id = ss.id
    LEFT JOIN daily_service_records dsr ON dsr.daily_record_id = dr.id
    LEFT JOIN meal_quantities mq ON mq.daily_service_record_id = dsr.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (user?.role === "SITE_MANAGER") {
    sql += ` AND s.id IN (SELECT site_id FROM user_site_access WHERE user_id = $${params.length + 1})`;
    params.push(user.id);
  }

  if (startDate) {
    sql += ` AND (dr.record_date >= $${params.length + 1} OR dr.record_date IS NULL)`;
    params.push(startDate);
  }
  if (endDate) {
    sql += ` AND (dr.record_date <= $${params.length + 1} OR dr.record_date IS NULL)`;
    params.push(endDate);
  }

  sql += ` GROUP BY s.id, s.name, ss.id, ss.name ORDER BY s.name, ss.name`;

  const result = await query(sql, params);
  return { success: true, data: result.rows };
});