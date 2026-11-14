import { defineHandler } from "./_libs/h3.mjs";
import { query } from "./index.mjs";
//#region server/routes/api/sites/[id].get.ts
var _id__get_default = defineHandler(async (event) => {
	const id = event.params.id;
	const user = event.context.user;
	const result = await query("SELECT * FROM sites WHERE id = $1", [parseInt(id)]);
	if (result.rows.length === 0) return {
		success: false,
		message: "Site non trouvé"
	};
	const site = result.rows[0];
	if (user?.role !== "SUPER_ADMIN") {
		if ((await query("SELECT * FROM user_site_access WHERE user_id = $1 AND site_id = $2", [user.id, parseInt(id)])).rows.length === 0) return {
			success: false,
			message: "Accès refusé"
		};
	}
	return {
		success: true,
		data: site
	};
});
//#endregion
export { _id__get_default as default };
