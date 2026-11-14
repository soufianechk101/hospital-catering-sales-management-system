import { defineHandler } from "nitro";
import { readBody } from "nitro/h3";
import { query } from "../../../database/db";

export default defineHandler(async (event) => {
  try {
    const body = await readBody<{ type: string; start_date?: string; end_date?: string; sub_site_id?: number; service_id?: number }>(event);

    if (!body.type) {
      return { success: false, message: "Type de rapport requis" };
    }

    let data;
    let filename = `rapport_${body.type}_${Date.now()}`;

    if (body.type === "journal_sub_site") {
      const result = await query(
        `SELECT dr.*, ss.name as sub_site_name, s.name as site_name
         FROM daily_records dr
         INNER JOIN sub_sites ss ON dr.sub_site_id = ss.id
         INNER JOIN sites s ON s.id = ss.site_id
         WHERE dr.sub_site_id = $1 ${body.start_date ? "AND dr.record_date >= $2" : ""} ${body.end_date ? "AND dr.record_date <= $3" : ""}
         ORDER BY dr.record_date DESC`,
        body.sub_site_id ? [body.sub_site_id, body.start_date, body.end_date] : [1, body.start_date, body.end_date]
      );
      data = result.rows;
      filename = `journal_sous_site_${body.sub_site_id}_${Date.now()}.json`;
    } else if (body.type === "journal_global") {
      const result = await query(
        `SELECT s.name as site_name, ss.name as sub_site_name, dr.record_date, SUM(mq.quantity) as total_quantity, SUM(mq.revenue) as total_revenue
         FROM daily_records dr
         INNER JOIN sub_sites ss ON dr.sub_site_id = ss.id
         INNER JOIN sites s ON s.id = ss.site_id
         INNER JOIN daily_service_records dsr ON dsr.daily_record_id = dr.id
         INNER JOIN meal_quantities mq ON mq.daily_service_record_id = dsr.id
         WHERE 1=1 ${body.start_date ? "AND dr.record_date >= $1" : ""} ${body.end_date ? "AND dr.record_date <= $2" : ""}
         GROUP BY s.name, ss.name, dr.record_date
         ORDER BY dr.record_date DESC`,
        body.start_date ? [body.start_date, body.end_date] : [null, null]
      );
      data = result.rows;
      filename = `journal_global_${Date.now()}.json`;
    }

    return { success: true, data, filename };
  } catch (error) {
    console.error("Generate report error:", error);
    return { success: false, message: "Erreur lors de la génération du rapport" };
  }
});