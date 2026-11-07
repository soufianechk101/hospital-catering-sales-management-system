import { Migration } from '@nitro/db'

export default class extends Migration {
  async up() {
    this.db.schema.createTable('audit_logs', (table) => {
      table.uuid('id').primary()
      table.uuid('user_id').nullable()
      table.string('action').notNull() // create, update, delete, login, logout
      table.text('entity_type').notNull() // e.g., daily_record, service, price, user
      table.uuid('entity_id').nullable()
      table.text('previous_values').nullable() // JSON
      table.text('new_values').nullable() // JSON
      table.uuid('site_id').nullable()
      table.uuid('sub_site_id').nullable()
      table.string('ip_address').nullable()
      table.string('user_agent').nullable()
      table.timestamps(true, true)
      table.foreign('user_id').references('users.id')
    })

    this.db.schema.alterTable('audit_logs', (table) => {
      table.index(['entity_type', 'entity_id'], 'idx_audit_logs_entity')
      table.index(['created_at'], 'idx_audit_logs_created')
    })
  }

  async down() {
    this.db.schema.dropTable('audit_logs')
  }
}