import { sql } from "kysely";

export async function up(db): Promise<void> {
  await db.schema.createTable("meal_quantities").addColumn("id", "serial", (col) => col.primaryKey()).addColumn("daily_service_record_id", "integer", (col) => col.notNull()).addColumn("meal_category_id", "integer", (col) => col.notNull()).addColumn("quantity", "integer", (col) => col.defaultTo(0)).addColumn("unit_price", "decimal(12,2)", (col) => col.notNull()).addColumn("revenue", "decimal(12,2)", (col) => col.defaultTo(0)).addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`now()`)).addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`now()`)).execute();
}

export async function down(db): Promise<void> {
  await db.schema.dropTable("meal_quantities").execute();
}