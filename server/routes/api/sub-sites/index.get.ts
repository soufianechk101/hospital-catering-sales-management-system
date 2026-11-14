import { defineHandler } from "nitro";
import { query } from "../../../database/db";

export default defineHandler(async (event) => {
  const user = event.context.user;

  let result;
  if (user?.role === "SUPER_ADMIN") {
    result = await query("SELECT * FROM sub_sites ORDER BY id");
  } else {
    result = await query(
      `SELECT ss.* FROM sub_sites ss INNER JOIN user_sub_site_access usa ON ss.id = usa.sub_site_id WHERE usa.user_id = $1 ORDER BY ss.id`,
      [user.id]
    );
  }

  return { success: true, data: result.rows };
});