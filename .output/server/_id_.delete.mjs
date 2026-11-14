import { defineHandler } from "./_libs/h3.mjs";
import { query } from "./index.mjs";
//#region server/routes/api/daily-records/[id].delete.ts
var _id__delete_default = defineHandler(async (event) => {
	try {
		const id = event.params.id;
		const recordResult = await query("SELECT * FROM daily_records WHERE id = $1", [parseInt(id)]);
		if (recordResult.rows.length === 0) return {
			success: false,
			message: "Enregistrement non trouvé"
		};
		const dailyRecord = recordResult.rows[0];
		const user = event.context.user;
		if (user?.role !== "SUPER_ADMIN") {
			if ((await query("SELECT * FROM user_sub_site_access WHERE user_id = $1 AND sub_site_id = $2", [user.id, dailyRecord.sub_site_id])).rows.length === 0) return {
				success: false,
				message: "Accès refusé"
			};
		}
		await query("DELETE FROM daily_records WHERE id = $1", [parseInt(id)]);
		await query("INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES ($1, 'DELETE', 'daily_record', $2)", [user.id, parseInt(id)]);
		return {
			success: true,
			message: "Enregistrement supprimé"
		};
	} catch (error) {
		console.error("Delete daily record error:", error);
		return {
			success: false,
			message: "Erreur lors de la suppression"
		};
	}
});
//#endregion
export { _id__delete_default as default };
