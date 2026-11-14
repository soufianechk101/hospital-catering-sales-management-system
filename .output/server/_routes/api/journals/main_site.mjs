import { defineHandler } from "../../../_libs/h3.mjs";
import { query } from "../../../index.mjs";
//#region server/routes/api/journals/main-site.get.ts
var main_site_get_default = defineHandler(async (event) => {
	const siteId = event.query.site_id;
	const startDate = event.query.start_date;
	const endDate = event.query.end_date;
	if (!siteId) return {
		success: false,
		message: "ID site requis"
	};
	const user = event.context.user;
	if (user?.role !== "SUPER_ADMIN") {
		if ((await query("SELECT * FROM user_site_access WHERE user_id = $1 AND site_id = $2", [user.id, parseInt(siteId)])).rows.length === 0) return {
			success: false,
			message: "Accès refusé"
		};
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
	const params = [parseInt(siteId)];
	if (startDate) {
		sql += ` AND (dr.record_date >= $2 OR dr.record_date IS NULL)`;
		params.push(startDate);
	}
	if (endDate) {
		sql += ` AND (dr.record_date <= $${params.length + 1} OR dr.record_date IS NULL)`;
		params.push(endDate);
	}
	sql += ` GROUP BY ss.id, ss.name ORDER BY ss.name`;
	return {
		success: true,
		data: (await query(sql, params)).rows
	};
});
//#endregion
export { main_site_get_default as default };
