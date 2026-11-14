import { defineHandler } from "./_libs/h3.mjs";
import { query } from "./index.mjs";
//#region server/routes/api/prices/[id].delete.ts
var _id__delete_default = defineHandler(async (event) => {
	try {
		const id = event.params.id;
		if ((await query("DELETE FROM prices WHERE id = $1 RETURNING id", [parseInt(id)])).rows.length === 0) return {
			success: false,
			message: "Prix non trouvé"
		};
		await query("INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES ($1, 'DELETE', 'price', $2)", [event.context.user.id, parseInt(id)]);
		return {
			success: true,
			message: "Prix supprimé"
		};
	} catch (error) {
		console.error("Delete price error:", error);
		return {
			success: false,
			message: "Erreur lors de la suppression"
		};
	}
});
//#endregion
export { _id__delete_default as default };
