import { defineHandler } from "nitro";
import { query } from "../../../database/db";

export default defineHandler(async (event) => {
  const subSiteId = event.query.sub_site_id as string;
  const startDate = event.query.start_date as string;
  const endDate = event.query.end_date as string;

  if (!subSiteId) {
    return { success: false, message: "ID sous-site requis" };
  }

  // Check access
  const user = event.context.user;
  if (user?.role !== "SUPER_ADMIN") {
    const access = await query(
      "SELECT * FROM user_sub_site_access WHERE user_id = $1 AND sub_site_id = $2",
      [user.id, parseInt(subSiteId)]
    );
    if (access.rows.length === 0) {
      return { success: false, message: "Accès refusé" };
    }
  }

  let sql = `
    SELECT dr.*, ss.name as sub_site_name
    FROM daily_records dr
    INNER JOIN sub_sites ss ON dr.sub_site_id = ss.id
    WHERE dr.sub_site_id = $1
  `;
  const params: any[] = [parseInt(subSiteId)];

  if (startDate) {
    sql += ` AND dr.record_date >= $2`;
    params.push(startDate);
  }
  if (endDate) {
    sql += ` AND dr.record_date <= $${params.length + 1}`;
    params.push(endDate);
  }

  sql += ` ORDER BY dr.record_date DESC`;

  const result = await query(sql, params);
  return { success: true, data: result.rows };
});