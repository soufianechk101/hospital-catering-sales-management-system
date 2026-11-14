import { defineHandler } from "../../../_libs/h3.mjs";
import { readBody } from "../../../_libs/h33.mjs";
import { query } from "../../../index.mjs";
//#region server/routes/api/services/create.post.ts
var create_post_default = defineHandler(async (event) => {
	try {
		const body = await readBody(event);
		if (!body.name || !body.code || !body.sub_site_id) return {
			success: false,
			message: "Nom, code et sous-site requis"
		};
		const result = await query(`INSERT INTO services (sub_site_id, name, code) VALUES ($1, $2, $3) RETURNING *`, [
			body.sub_site_id,
			body.name,
			body.code
		]);
		await query("INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES ($1, 'CREATE', 'service', $2)", [event.context.user.id, result.rows[0].id]);
		return {
			success: true,
			data: result.rows[0]
		};
	} catch (error) {
		console.error("Create service error:", error);
		return {
			success: false,
			message: "Erreur lors de la création du service"
		};
	}
});
//#endregion
export { create_post_default as default };
