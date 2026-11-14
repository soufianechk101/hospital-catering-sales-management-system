import { defineHandler } from "../../../_libs/h3.mjs";
import { query } from "../../../index.mjs";
import jwt from "jsonwebtoken";
//#region server/routes/api/auth/me.get.ts
var JWT_SECRET = process.env.JWT_SECRET || "medicatering-secret-key-change-in-production";
var me_get_default = defineHandler(async (event) => {
	try {
		const authHeader = event.node.req.headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) return {
			success: false,
			message: "Token manquant"
		};
		const token = authHeader.substring(7);
		const result = await query("SELECT id, username, email, full_name, role, is_active FROM users WHERE id = $1", [jwt.verify(token, JWT_SECRET).userId]);
		if (result.rows.length === 0) return {
			success: false,
			message: "Utilisateur non trouvé"
		};
		return {
			success: true,
			user: result.rows[0]
		};
	} catch (error) {
		return {
			success: false,
			message: "Token invalide"
		};
	}
});
//#endregion
export { me_get_default as default };
