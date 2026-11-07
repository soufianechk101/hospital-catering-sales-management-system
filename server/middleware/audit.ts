import { defineMiddleware } from "nitro";
import { query } from "../database/db";

export default defineMiddleware(async (event, handler) => {
  handler(event);

  // Log audit after response for data mutations
  const method = event.node.req.method;
  if (method === "POST" || method === "PUT" || method === "PATCH" || method === "DELETE") {
    const user = event.context.user;
    if (user) {
      const url = event.node.req.url || "";
      const entityMatch = url.match(/\/api\/([^\/]+)/);
      if (entityMatch) {
        const entity = entityMatch[1];
        try {
          await query(
            `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5, $6)`,
            [user.id, method, entity, 0, event.node.req.socket.remoteAddress || "", event.node.req.headers["user-agent"] || ""]
          );
        } catch (e) {
          console.error("Audit log error:", e);
        }
      }
    }
  }
});