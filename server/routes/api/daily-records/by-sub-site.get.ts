import { defineHandler } from "nitro";
import { query } from "../../database/db";

export default defineHandler(async (event) => {
  const subSiteId = event.query.sub_site_id as string;
  const date = event.query.date as string;

  if (!subSiteId) {
    return { success: false, message: "ID sous-site requis" };
  }

  let sql = `SELECT dr.* FROM daily_records dr WHERE dr.sub_site_id = $1`;
  const params: any[] = [parseInt(subSiteId)];

  if (date) {
    sql += ` AND dr.record_date = $2`;
    params.push(date);
  }

  sql += ` ORDER BY dr.record_date DESC, dr.created_at DESC`;

  const result = await query(sql, params);
  return { success: true, data: result.rows };
});