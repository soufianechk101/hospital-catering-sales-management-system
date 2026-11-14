import { defineHandler } from "./_libs/h3.mjs";
import { readBody } from "./_libs/h33.mjs";
import { query } from "./index.mjs";
//#region server/routes/api/daily-records/[id].put.ts
var _id__put_default = defineHandler(async (event) => {
	try {
		const id = event.params.id;
		const body = await readBody(event);
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
		for (const service of body.services) if (service.quantities.reduce((sum, q) => sum + q.quantity, 0) > service.passage_global) return {
			success: false,
			message: `Quantité totale dépasse le passage global pour le service ID ${service.service_id}`
		};
		const pricesResult = await query(`SELECT meal_category_id, amount FROM prices WHERE effective_from <= $1 AND (effective_to IS NULL OR effective_to >= $1)`, [dailyRecord.record_date]);
		const prices = {};
		pricesResult.rows.forEach((p) => prices[p.meal_category_id] = parseFloat(p.amount));
		await query("UPDATE daily_records SET updated_by = $1, updated_at = now() WHERE id = $2", [user.id, parseInt(id)]);
		for (const service of body.services) {
			const existingResult = await query("SELECT id FROM daily_service_records WHERE daily_record_id = $1 AND service_id = $2 AND meal_period_id = $3", [
				parseInt(id),
				service.service_id,
				service.meal_period_id
			]);
			let serviceRecordId;
			if (existingResult.rows.length > 0) {
				serviceRecordId = existingResult.rows[0].id;
				await query("UPDATE daily_service_records SET passage_global = $1, updated_at = now() WHERE id = $2", [service.passage_global, serviceRecordId]);
			} else serviceRecordId = (await query("INSERT INTO daily_service_records (daily_record_id, service_id, meal_period_id, passage_global) VALUES ($1, $2, $3, $4) RETURNING id", [
				parseInt(id),
				service.service_id,
				service.meal_period_id,
				service.passage_global
			])).rows[0].id;
			await query("DELETE FROM meal_quantities WHERE daily_service_record_id = $1", [serviceRecordId]);
			for (const qty of service.quantities) {
				const unitPrice = prices[qty.meal_category_id] || 0;
				const revenue = qty.quantity * unitPrice;
				await query("INSERT INTO meal_quantities (daily_service_record_id, meal_category_id, quantity, unit_price, revenue) VALUES ($1, $2, $3, $4, $5)", [
					serviceRecordId,
					qty.meal_category_id,
					qty.quantity,
					unitPrice,
					revenue
				]);
			}
		}
		await query("INSERT INTO audit_logs (user_id, action, entity_type, entity_id) VALUES ($1, 'UPDATE', 'daily_record', $2)", [user.id, parseInt(id)]);
		return {
			success: true,
			message: "Enregistrement mis à jour"
		};
	} catch (error) {
		console.error("Update daily record error:", error);
		return {
			success: false,
			message: "Erreur lors de la mise à jour"
		};
	}
});
//#endregion
export { _id__put_default as default };
