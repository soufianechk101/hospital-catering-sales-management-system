import { defineHandler } from "../../_libs/h3.mjs";
import { query } from "../../index.mjs";
//#region server/routes/api/meal-periods/index.get.ts
var index_get_default = defineHandler(async () => {
	return {
		success: true,
		data: (await query("SELECT * FROM meal_periods ORDER BY sort_order")).rows
	};
});
//#endregion
export { index_get_default as default };
