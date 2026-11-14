import { defineHandler } from "nitro";
import { query } from "../../../database/db";

export default defineHandler(async (event) => {
  const user = event.context.user;
  const subSiteId = event.query.sub_site_id;

  let result;
  if (subSiteId) {
    result = await query("SELECT * FROM services WHERE sub_site_id = $1 ORDER BY id", [parseInt(subSiteId as string)]);
  } else if (user?.role === "SUPER_ADMIN") {
    result = await query("SELECT * FROM services ORDER BY id");
  } else {
    result = await query(
      `SELECT s.* FROM services s INNER JOIN user_sub_site_access usa ON s.sub_site_id = usa.sub_site_id WHERE usa.user_id = $1 ORDER BY s.id`,
      [user.id]
    );
  }

  return { success: true, data: result.rows };
});