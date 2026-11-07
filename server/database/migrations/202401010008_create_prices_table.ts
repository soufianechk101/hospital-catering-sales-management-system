import { sql } from "kysely";

export async function up(db): Promise<void> {
  await db.schema.createTable("prices").addColumn("id", "serial", (col) => col.primaryKey()).addColumn("meal_category_id", "integer", (col) => col.notNull()).addColumn("amount", "decimal(12,2)", (col) => col.notNull()).addColumn("effective_from", "date", (col) => col.notNull()).addColumn("effective_to", "date", (col) => col.nullable()).addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`now()`)).addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`now()`)).execute();
}

export async function down(db): Promise<void> {
  await db.schema.dropTable("prices").execute();
}