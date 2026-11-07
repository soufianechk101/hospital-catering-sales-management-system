import { defineHandler } from "nitro";
import { query } from "../../database/db";

export default defineHandler(async (event) => {
  const user = event.context.user;

  let result;
  if (user?.role === "SUPER_ADMIN") {
    result = await query("SELECT * FROM sites ORDER BY id");
  } else {
    result = await query(
      `SELECT s.* FROM sites s INNER JOIN user_site_access usa ON s.id = usa.site_id WHERE usa.user_id = $1 ORDER BY s.id`,
      [user.id]
    );
  }

  return { success: true, data: result.rows };
});