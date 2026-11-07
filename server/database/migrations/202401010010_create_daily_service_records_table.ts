import { sql } from "kysely";

export async function up(db): Promise<void> {
  await db.schema.createTable("daily_service_records").addColumn("id", "serial", (col) => col.primaryKey()).addColumn("daily_record_id", "integer", (col) => col.notNull()).addColumn("service_id", "integer", (col) => col.notNull()).addColumn("meal_period_id", "integer", (col) => col.notNull()).addColumn("passage_global", "integer", (col) => col.defaultTo(0)).addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`now()`)).addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`now()`)).execute();
}

export async function down(db): Promise<void> {
  await db.schema.dropTable("daily_service_records").execute();
}