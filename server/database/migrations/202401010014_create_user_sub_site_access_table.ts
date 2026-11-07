import { sql } from "kysely";

export async function up(db): Promise<void> {
  await db.schema.createTable("user_sub_site_access").addColumn("id", "serial", (col) => col.primaryKey()).addColumn("user_id", "integer", (col) => col.notNull()).addColumn("sub_site_id", "integer", (col) => col.notNull()).addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`now()`)).execute();
}

export async function down(db): Promise<void> {
  await db.schema.dropTable("user_sub_site_access").execute();
}