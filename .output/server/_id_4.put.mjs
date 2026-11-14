import { defineHandler } from "./_libs/h3.mjs";
import { readBody } from "./_libs/h33.mjs";
import { query } from "./index.mjs";
//#region server/routes/api/sites/[id].put.ts
var _id__put_default = defineHandler(async (event) => {
	try {
		const id = event.params.id;
		const body = await readBody(event);
		const result = await query(`UPDATE sites SET name = COALESCE($1, name), code = COALESCE($2, code), city = COALESCE($3, city), address = COALESCE($4, address), is_active = COALESCE($5, is_active), updated_at = now() WHERE id = $6 RETURNING *`, [
			body.name,
			body.code,
			body.city,
			body.address,
			body.is_active,
			parseInt(id)
		]);
		if (result.rows.length === 0) return {
			success: false,
			message: "Site non trouvé"
		};
		await query("INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES ($1, 'UPDATE', 'site', $2)", [event.context.user.id, parseInt(id)]);
		return {
			success: true,
			data: result.rows[0]
		};
	} catch (error) {
		console.error("Update site error:", error);
		return {
			success: false,
			message: "Erreur lors de la mise à jour"
		};
	}
});
//#endregion
export { _id__put_default as default };
