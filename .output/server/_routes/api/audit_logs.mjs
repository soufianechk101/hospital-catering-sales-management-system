import { defineHandler } from "../../_libs/h3.mjs";
import { query } from "../../index.mjs";
//#region server/routes/api/audit-logs/index.get.ts
var index_get_default = defineHandler(async (event) => {
	if (event.context.user?.role !== "SUPER_ADMIN") return {
		success: false,
		message: "Accès refusé"
	};
	return {
		success: true,
		data: (await query("SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100")).rows
	};
});
//#endregion
export { index_get_default as default };
