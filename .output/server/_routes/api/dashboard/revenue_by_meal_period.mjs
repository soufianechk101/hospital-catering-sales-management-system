import { defineHandler } from "../../../_libs/h3.mjs";
import { query } from "../../../index.mjs";
//#region server/routes/api/dashboard/revenue-by-meal-period.get.ts
var revenue_by_meal_period_get_default = defineHandler(async (event) => {
	const user = event.context.user;
	const startDate = event.query.start_date;
	const endDate = event.query.end_date;
	let siteFilter = "";
	const params = [];
	if (user?.role === "SITE_MANAGER") {
		siteFilter = `AND s.id IN (SELECT site_id FROM user_site_access WHERE user_id = $${params.length + 1})`;
		params.push(user.id);
	} else if (user?.role === "SUB_SITE_MANAGER" || user?.role === "DATA_ENTRY") {
		siteFilter = `AND ss.id IN (SELECT sub_site_id FROM user_sub_site_access WHERE user_id = $${params.length + 1})`;
		params.push(user.id);
	}
	return {
		success: true,
		data: (await query(`SELECT mp.name as meal_period_name, COALESCE(SUM(mq.revenue), 0) as revenue, COALESCE(SUM(mq.quantity), 0) as quantity
     FROM meal_periods mp
     LEFT JOIN daily_service_records dsr ON dsr.meal_period_id = mp.id
     LEFT JOIN daily_records dr ON dr.id = dsr.daily_record_id
     LEFT JOIN meal_quantities mq ON mq.daily_service_record_id = dsr.id
     LEFT JOIN sub_sites ss ON ss.id = dr.sub_site_id
     LEFT JOIN sites s ON s.id = ss.site_id
     WHERE dr.record_date >= $1 AND dr.record_date <= $2 ${siteFilter}
     GROUP BY mp.id, mp.name
     ORDER BY mp.sort_order`, [
			startDate,
			endDate,
			...params
		])).rows
	};
});
//#endregion
export { revenue_by_meal_period_get_default as default };
