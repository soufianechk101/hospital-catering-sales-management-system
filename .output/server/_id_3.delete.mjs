import { defineHandler } from "./_libs/h3.mjs";
import { query } from "./index.mjs";
//#region server/routes/api/services/[id].delete.ts
var _id__delete_default = defineHandler(async (event) => {
	try {
		const id = event.params.id;
		if ((await query("DELETE FROM services WHERE id = $1 RETURNING id", [parseInt(id)])).rows.length === 0) return {
			success: false,
			message: "Service non trouvé"
		};
		await query("INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES ($1, 'DELETE', 'service', $2)", [event.context.user.id, parseInt(id)]);
		return {
			success: true,
			message: "Service supprimé"
		};
	} catch (error) {
		console.error("Delete service error:", error);
		return {
			success: false,
			message: "Erreur lors de la suppression"
		};
	}
});
//#endregion
export { _id__delete_default as default };
