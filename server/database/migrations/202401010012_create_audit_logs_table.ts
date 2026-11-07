import { sql } from "kysely";

export async function up(db): Promise<void> {
  await db.schema.createTable("audit_logs").addColumn("id", "serial", (col) => col.primaryKey()).addColumn("user_id", "integer", (col) => col.notNull()).addColumn("action", "varchar(100)", (col) => col.notNull()).addColumn("entity_type", "varchar(100)", (col) => col.notNull()).addColumn("entity_id", "integer", (col) => col.notNull()).addColumn("old_values", "jsonb", (col) => col.nullable()).addColumn("new_values", "jsonb", (col) => col.nullable()).addColumn("ip_address", "varchar(45)", (col) => col.nullable()).addColumn("user_agent", "text", (col) => col.nullable()).addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`now()`)).execute();
}

export async function down(db): Promise<void> {
  await db.schema.dropTable("audit_logs").execute();
}