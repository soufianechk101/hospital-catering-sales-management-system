import { defineHandler } from "nitro";
import { query } from "../../database/db";

export default defineHandler(async (event) => {
  const user = event.context.user;
  const startDate = event.query.start_date as string;
  const endDate = event.query.end_date as string;

  let siteFilter = "";
  const params: any[] = [];

  if (user?.role === "SITE_MANAGER") {
    siteFilter = `AND s.id IN (SELECT site_id FROM user_site_access WHERE user_id = $${params.length + 1})`;
    params.push(user.id);
  } else if (user?.role === "SUB_SITE_MANAGER" || user?.role === "DATA_ENTRY") {
    siteFilter = `AND s.id IN (SELECT site_id FROM sub_sites ss INNER JOIN user_sub_site_access usa ON ss.id = usa.sub_site_id WHERE usa.user_id = $${params.length + 1})`;
    params.push(user.id);
  }

  const result = await query(
    `SELECT s.name as site_name, COALESCE(SUM(mq.revenue), 0) as revenue
     FROM sites s
     LEFT JOIN sub_sites ss ON ss.site_id = s.id
     LEFT JOIN daily_records dr ON dr.sub_site_id = ss.id
     LEFT JOIN daily_service_records dsr ON dsr.daily_record_id = dr.id
     LEFT JOIN meal_quantities mq ON mq.daily_service_record_id = dsr.id
     WHERE dr.record_date >= $1 AND dr.record_date <= $2 ${siteFilter}
     GROUP BY s.id, s.name
     ORDER BY revenue DESC`,
    [startDate, endDate, ...params]
  );

  return { success: true, data: result.rows };
});