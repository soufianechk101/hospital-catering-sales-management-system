import { defineMiddleware } from "nitro";
import jwt from "jsonwebtoken";
import { query } from "../database/db";

const JWT_SECRET = process.env.JWT_SECRET || "medicatering-secret-key-change-in-production";

export default defineMiddleware(async (event, handler) => {
  const authHeader = event.node.req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const result = await query("SELECT id, username, email, full_name, role, is_active FROM users WHERE id = $1", [decoded.userId]);

      if (result.rows.length > 0 && result.rows[0].is_active) {
        event.context.user = result.rows[0];
      }
    } catch (error) {
      // Invalid token, continue without user
    }
  }

  handler(event);
});