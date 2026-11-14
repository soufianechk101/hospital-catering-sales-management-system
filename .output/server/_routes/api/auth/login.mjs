import { defineHandler } from "../../../_libs/h3.mjs";
import { readBody } from "../../../_libs/h33.mjs";
import { query } from "../../../index.mjs";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
//#region server/routes/api/auth/login.post.ts
var JWT_SECRET = process.env.JWT_SECRET || "medicatering-secret-key-change-in-production";
var login_post_default = defineHandler(async (event) => {
	try {
		const body = await readBody(event);
		if (!body.username || !body.password) return {
			success: false,
			message: "Nom d'utilisateur et mot de passe requis"
		};
		const result = await query("SELECT * FROM users WHERE username = $1 AND is_active = true", [body.username]);
		if (result.rows.length === 0) return {
			success: false,
			message: "Identifiants invalides"
		};
		const user = result.rows[0];
		if (!await bcrypt.compare(body.password, user.password_hash)) return {
			success: false,
			message: "Identifiants invalides"
		};
		return {
			success: true,
			token: jwt.sign({
				userId: user.id,
				username: user.username,
				role: user.role
			}, JWT_SECRET, { expiresIn: "24h" }),
			user: {
				id: user.id,
				username: user.username,
				email: user.email,
				full_name: user.full_name,
				role: user.role
			}
		};
	} catch (error) {
		console.error("Login error:", error);
		return {
			success: false,
			message: "Erreur serveur"
		};
	}
});
//#endregion
export { login_post_default as default };
