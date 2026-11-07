import { sql } from "kysely";

export async function up(db): Promise<void> {
  await db.schema.createTable("daily_records").addColumn("id", "serial", (col) => col.primaryKey()).addColumn("sub_site_id", "integer", (col) => col.notNull()).addColumn("record_date", "date", (col) => col.notNull()).addColumn("created_by", "integer", (col) => col.notNull()).addColumn("updated_by", "integer", (col) => col.nullable()).addColumn("status", "varchar(50)", (col) => col.defaultTo("draft")).addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`now()`)).addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`now()`)).execute();
}

export async function down(db): Promise<void> {
  await db.schema.dropTable("daily_records").execute();
}