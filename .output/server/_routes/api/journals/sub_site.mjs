import { defineHandler } from "../../../_libs/h3.mjs";
import { query } from "../../../index.mjs";
//#region server/routes/api/journals/sub-site.get.ts
var sub_site_get_default = defineHandler(async (event) => {
	const subSiteId = event.query.sub_site_id;
	const startDate = event.query.start_date;
	const endDate = event.query.end_date;
	if (!subSiteId) return {
		success: false,
		message: "ID sous-site requis"
	};
	const user = event.context.user;
	if (user?.role !== "SUPER_ADMIN") {
		if ((await query("SELECT * FROM user_sub_site_access WHERE user_id = $1 AND sub_site_id = $2", [user.id, parseInt(subSiteId)])).rows.length === 0) return {
			success: false,
			message: "Accès refusé"
		};
	}
	let sql = `
    SELECT dr.*, ss.name as sub_site_name
    FROM daily_records dr
    INNER JOIN sub_sites ss ON dr.sub_site_id = ss.id
    WHERE dr.sub_site_id = $1
  `;
	const params = [parseInt(subSiteId)];
	if (startDate) {
		sql += ` AND dr.record_date >= $2`;
		params.push(startDate);
	}
	if (endDate) {
		sql += ` AND dr.record_date <= $${params.length + 1}`;
		params.push(endDate);
	}
	sql += ` ORDER BY dr.record_date DESC`;
	return {
		success: true,
		data: (await query(sql, params)).rows
	};
});
//#endregion
export { sub_site_get_default as default };
