import { defineHandler } from "../../_libs/h3.mjs";
import { query } from "../../index.mjs";
//#region server/routes/api/prices/index.get.ts
var index_get_default = defineHandler(async (event) => {
	return {
		success: true,
		data: (await query(`SELECT p.*, mc.name as category_name, mc.code as category_code
     FROM prices p
     INNER JOIN meal_categories mc ON p.meal_category_id = mc.id
     WHERE p.effective_from <= $1 AND (p.effective_to IS NULL OR p.effective_to >= $1)
     ORDER BY mc.id`, [event.query.date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0]])).rows
	};
});
//#endregion
export { index_get_default as default };
