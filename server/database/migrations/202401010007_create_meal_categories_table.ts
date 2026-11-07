import { sql } from "kysely";

export async function up(db): Promise<void> {
  await db.schema.createTable("meal_categories").addColumn("id", "serial", (col) => col.primaryKey()).addColumn("name", "varchar(255)", (col) => col.notNull()).addColumn("code", "varchar(50)", (col) => col.notNull()).addColumn("is_active", "boolean", (col) => col.defaultTo(true)).addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`now()`)).addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`now()`)).execute();
}

export async function down(db): Promise<void> {
  await db.schema.dropTable("meal_categories").execute();
}