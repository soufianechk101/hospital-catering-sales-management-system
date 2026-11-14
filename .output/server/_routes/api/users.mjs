import { defineHandler } from "../../_libs/h3.mjs";
import { query } from "../../index.mjs";
//#region server/routes/api/users/index.get.ts
var index_get_default = defineHandler(async (event) => {
	if (event.context.user?.role !== "SUPER_ADMIN") return {
		success: false,
		message: "Accès refusé"
	};
	return {
		success: true,
		data: (await query("SELECT id, username, email, full_name, role, is_active, created_at FROM users ORDER BY id")).rows
	};
});
//#endregion
export { index_get_default as default };
