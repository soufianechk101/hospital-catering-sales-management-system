import { Migration } from '@nitro/db'

export default class extends Migration {
  async up() {
    this.db.schema.createTable('sales_lines', (table) => {
      table.uuid('id').primary()
      table.uuid('daily_record_id').notNull()
      table.uuid('service_id').notNull()
      table.uuid('meal_period_id').notNull()
      table.decimal('passage_global', 10, 2).notNull()
      table.decimal('total_revenue', 12, 2).notNull()
      table.jsonb('meal_quantities_json').notNull() // JSON with all category quantities
      table.timestamps(true, true)
      table.foreign('daily_record_id').references('daily_records.id')
      table.foreign('service_id').references('services.id')
      table.foreign('meal_period_id').references('meal_periods.id')
    })

    this.db.schema.alterTable('sales_lines', (table) => {
      table.index(['daily_record_id'], 'idx_sales_lines_daily_record')
    })
  }

  async down() {
    this.db.schema.dropTable('sales_lines')
  }
}