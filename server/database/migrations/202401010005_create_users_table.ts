import { sql } from "kysely";

export async function up(db): Promise<void> {
  await db.schema.createTable("users").addColumn("id", "serial", (col) => col.primaryKey()).addColumn("username", "varchar(100)", (col) => col.notNull()).addColumn("email", "varchar(255)", (col) => col.notNull()).addColumn("password_hash", "varchar(255)", (col) => col.notNull()).addColumn("full_name", "varchar(255)", (col) => col.notNull()).addColumn("role", "varchar(50)", (col) => col.notNull()).addColumn("is_active", "boolean", (col) => col.defaultTo(true)).addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`now()`)).addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`now()`)).execute();
}

export async function down(db): Promise<void> {
  await db.schema.dropTable("users").execute();
}