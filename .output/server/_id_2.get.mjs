import { defineHandler } from "./_libs/h3.mjs";
import { query } from "./index.mjs";
//#region server/routes/api/services/[id].get.ts
var _id__get_default = defineHandler(async (event) => {
	const id = event.params.id;
	const user = event.context.user;
	const result = await query("SELECT * FROM services WHERE id = $1", [parseInt(id)]);
	if (result.rows.length === 0) return {
		success: false,
		message: "Service non trouvé"
	};
	const service = result.rows[0];
	if (user?.role !== "SUPER_ADMIN") {
		if ((await query("SELECT * FROM user_sub_site_access WHERE user_id = $1 AND sub_site_id = $2", [user.id, service.sub_site_id])).rows.length === 0) return {
			success: false,
			message: "Accès refusé"
		};
	}
	return {
		success: true,
		data: service
	};
});
//#endregion
export { _id__get_default as default };
