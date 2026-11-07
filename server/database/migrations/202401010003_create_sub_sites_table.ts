import { sql } from "kysely";

export async function up(db): Promise<void> {
  await db.schema.createTable("sub_sites").addColumn("id", "serial", (col) => col.primaryKey()).addColumn("site_id", "integer", (col) => col.notNull()).addColumn("name", "varchar(255)", (col) => col.notNull()).addColumn("code", "varchar(50)", (col) => col.notNull()).addColumn("address", "text", (col) => col.nullable()).addColumn("is_active", "boolean", (col) => col.defaultTo(true)).addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`now()`)).addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`now()`)).execute();
}

export async function down(db): Promise<void> {
  await db.schema.dropTable("sub_sites").execute();
}