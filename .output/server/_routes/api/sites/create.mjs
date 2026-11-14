import { defineHandler } from "../../../_libs/h3.mjs";
import { readBody } from "../../../_libs/h33.mjs";
import { query } from "../../../index.mjs";
//#region server/routes/api/sites/create.post.ts
var create_post_default = defineHandler(async (event) => {
	try {
		const body = await readBody(event);
		if (!body.name || !body.code || !body.city) return {
			success: false,
			message: "Nom, code et ville requis"
		};
		const result = await query(`INSERT INTO sites (company_id, name, code, city, address) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [
			body.company_id,
			body.name,
			body.code,
			body.city,
			body.address || null
		]);
		await query("INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES ($1, 'CREATE', 'site', $2)", [event.context.user.id, result.rows[0].id]);
		return {
			success: true,
			data: result.rows[0]
		};
	} catch (error) {
		console.error("Create site error:", error);
		return {
			success: false,
			message: "Erreur lors de la création du site"
		};
	}
});
//#endregion
export { create_post_default as default };
