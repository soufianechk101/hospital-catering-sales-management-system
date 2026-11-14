import { defineHandler } from "../../../_libs/h3.mjs";
import { query } from "../../../index.mjs";
//#region server/routes/api/daily-records/by-sub-site.get.ts
var by_sub_site_get_default = defineHandler(async (event) => {
	const subSiteId = event.query.sub_site_id;
	const date = event.query.date;
	if (!subSiteId) return {
		success: false,
		message: "ID sous-site requis"
	};
	let sql = `SELECT dr.* FROM daily_records dr WHERE dr.sub_site_id = $1`;
	const params = [parseInt(subSiteId)];
	if (date) {
		sql += ` AND dr.record_date = $2`;
		params.push(date);
	}
	sql += ` ORDER BY dr.record_date DESC, dr.created_at DESC`;
	return {
		success: true,
		data: (await query(sql, params)).rows
	};
});
//#endregion
export { by_sub_site_get_default as default };
