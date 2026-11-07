import { Migration } from '@nitro/db'

export default class extends Migration {
  async up() {
    this.db.schema.createTable('daily_records', (table) => {
      table.uuid('id').primary()
      table.uuid('sub_site_id').notNull()
      table.uuid('user_id').notNull() // user who created the record
      table.date('record_date').notNull() // the business/saisie date
      table.date('created_at').notNull()
      table.decimal('passage_global', 10, 2).notNull() // total passage for this record
      table.decimal('total_revenue', 12, 2).default('0')
      table.boolean('is_validated').default(false)
      table.timestamps(true, true)
      table.foreign('sub_site_id').references('sub_sites.id')
      table.foreign('user_id').references('users.id')
    })

    this.db.schema.alterTable('daily_records', (table) => {
      table.index(['sub_site_id', 'record_date'], 'idx_daily_records_subsite_date')
    })
  }

  async down() {
    this.db.schema.dropTable('daily_records')
  }
}