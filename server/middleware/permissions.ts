import { defineMiddleware } from "nitro";
import { query } from "../database/db";

export default defineMiddleware(async (event, handler) => {
  const user = event.context.user;
  const url = event.node.req.url || "";
  const method = event.node.req.method;

  // Public routes
  if (url.includes("/auth/login") || url.includes("/auth/logout") || url.includes("/auth/me")) {
    return handler(event);
  }

  // Protected routes
  if (!user) {
    event.node.res.statusCode = 401;
    event.node.res.setHeader("Content-Type", "application/json");
    event.node.res.end(JSON.stringify({ success: false, message: "Authentification requise" }));
    return;
  }

  // Site isolation check
  const siteIdMatch = url.match(/\/sites\/(\d+)/);
  const subSiteIdMatch = url.match(/\/sub-sites\/(\d+)/);
  const subSiteIdParamMatch = url.match(/sub_site_id=(\d+)/);

  if (siteIdMatch) {
    const siteId = parseInt(siteIdMatch[1]);
    const access = await query(
      "SELECT * FROM user_site_access WHERE user_id = $1 AND site_id = $2",
      [user.id, siteId]
    );
    if (access.rows.length === 0 && user.role !== "SUPER_ADMIN") {
      event.node.res.statusCode = 403;
      event.node.res.setHeader("Content-Type", "application/json");
      event.node.res.end(JSON.stringify({ success: false, message: "Accès refusé à ce site" }));
      return;
    }
  }

  if (subSiteIdMatch) {
    const subSiteId = parseInt(subSiteIdMatch[1]);
    const access = await query(
      "SELECT * FROM user_sub_site_access WHERE user_id = $1 AND sub_site_id = $2",
      [user.id, subSiteId]
    );
    if (access.rows.length === 0 && user.role !== "SUPER_ADMIN") {
      event.node.res.statusCode = 403;
      event.node.res.setHeader("Content-Type", "application/json");
      event.node.res.end(JSON.stringify({ success: false, message: "Accès refusé à ce sous-site" }));
      return;
    }
  }

  if (subSiteIdParamMatch) {
    const subSiteId = parseInt(subSiteIdParamMatch[1]);
    const access = await query(
      "SELECT * FROM user_sub_site_access WHERE user_id = $1 AND sub_site_id = $2",
      [user.id, subSiteId]
    );
    if (access.rows.length === 0 && user.role !== "SUPER_ADMIN") {
      event.node.res.statusCode = 403;
      event.node.res.setHeader("Content-Type", "application/json");
      event.node.res.end(JSON.stringify({ success: false, message: "Accès refusé à ce sous-site" }));
      return;
    }
  }

  handler(event);
});