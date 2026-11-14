import { defineHandler } from "../../_libs/h3.mjs";
import { query } from "../../index.mjs";
//#region server/routes/api/meal-categories/index.get.ts
var index_get_default = defineHandler(async () => {
	return {
		success: true,
		data: (await query("SELECT * FROM meal_categories WHERE is_active = true ORDER BY id")).rows
	};
});
//#endregion
export { index_get_default as default };
