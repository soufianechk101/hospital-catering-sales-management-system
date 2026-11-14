import { defineHandler } from "../../../_libs/h3.mjs";
import { query } from "../../../index.mjs";
//#region server/routes/api/dashboard/stats.get.ts
var stats_get_default = defineHandler(async (event) => {
	const user = event.context.user;
	const date = event.query.date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
	let siteFilter = "";
	const params = [];
	if (user?.role === "SITE_MANAGER") {
		siteFilter = `AND s.id IN (SELECT site_id FROM user_site_access WHERE user_id = $${params.length + 1})`;
		params.push(user.id);
	} else if (user?.role === "SUB_SITE_MANAGER" || user?.role === "DATA_ENTRY") {
		siteFilter = `AND ss.id IN (SELECT sub_site_id FROM user_sub_site_access WHERE user_id = $${params.length + 1})`;
		params.push(user.id);
	}
	const todayResult = await query(`SELECT COALESCE(SUM(mq.revenue), 0) as revenue, COALESCE(SUM(mq.quantity), 0) as meals
     FROM daily_records dr
     INNER JOIN daily_service_records dsr ON dsr.daily_record_id = dr.id
     INNER JOIN meal_quantities mq ON mq.daily_service_record_id = dsr.id
     INNER JOIN sub_sites ss ON ss.id = dr.sub_site_id
     INNER JOIN sites s ON s.id = ss.site_id
     WHERE dr.record_date = $1 ${siteFilter}`, [date, ...params]);
	const monthResult = await query(`SELECT COALESCE(SUM(mq.revenue), 0) as revenue, COALESCE(SUM(mq.quantity), 0) as meals
     FROM daily_records dr
     INNER JOIN daily_service_records dsr ON dsr.daily_record_id = dr.id
     INNER JOIN meal_quantities mq ON mq.daily_service_record_id = dsr.id
     INNER JOIN sub_sites ss ON ss.id = dr.sub_site_id
     INNER JOIN sites s ON s.id = ss.site_id
     WHERE dr.record_date >= $1 AND dr.record_date <= $2 ${siteFilter}`, [
		date.substring(0, 7) + "-01",
		date,
		...params
	]);
	const servicesResult = await query(`SELECT COUNT(DISTINCT s.id) as count FROM services s
     INNER JOIN sub_sites ss ON ss.id = s.sub_site_id
     INNER JOIN sites st ON st.id = ss.site_id
     WHERE s.is_active = true AND ss.is_active = true AND st.is_active = true ${siteFilter}`, params);
	const subSitesResult = await query(`SELECT COUNT(*) as count FROM sub_sites ss
     INNER JOIN sites s ON s.id = ss.site_id
     WHERE ss.is_active = true AND s.is_active = true ${siteFilter}`, params);
	const sitesResult = await query(`SELECT COUNT(*) as count FROM sites WHERE is_active = true ${siteFilter.replace("ss.id", "s.id").replace("user_sub_site_access", "user_site_access")}`, params);
	return {
		success: true,
		data: {
			today_revenue: parseFloat(todayResult.rows[0].revenue),
			today_meals: parseInt(todayResult.rows[0].meals),
			month_revenue: parseFloat(monthResult.rows[0].revenue),
			month_meals: parseInt(monthResult.rows[0].meals),
			active_services: parseInt(servicesResult.rows[0].count),
			sub_sites: parseInt(subSitesResult.rows[0].count),
			sites: parseInt(sitesResult.rows[0].count)
		}
	};
});
//#endregion
export { stats_get_default as default };
