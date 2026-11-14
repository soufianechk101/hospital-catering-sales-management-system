import { defineHandler } from "../../../_libs/h3.mjs";
//#region server/routes/api/auth/logout.post.ts
var logout_post_default = defineHandler(async () => {
	return {
		success: true,
		message: "Déconnexion réussie"
	};
});
//#endregion
export { logout_post_default as default };
