import { sql } from "kysely";

export async function up(db): Promise<void> {
  await db.schema.createTable("meal_periods").addColumn("id", "serial", (col) => col.primaryKey()).addColumn("name", "varchar(100)", (col) => col.notNull()).addColumn("code", "varchar(50)", (col) => col.notNull()).addColumn("sort_order", "integer", (col) => col.defaultTo(0)).addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`now()`)).addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`now()`)).execute();
}

export async function down(db): Promise<void> {
  await db.schema.dropTable("meal_periods").execute();
}