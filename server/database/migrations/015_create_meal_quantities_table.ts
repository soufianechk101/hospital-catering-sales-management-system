import { Migration } from '@nitro/db'

export default class extends Migration {
  async up() {
    this.db.schema.createTable('meal_quantities', (table) => {
      table.uuid('id').primary()
      table.uuid('daily_service_record_id').notNull()
      table.uuid('meal_category_id').notNull()
      table.decimal('quantity', 10, 2).notNull()
      table.decimal('revenue', 12, 2).notNull() // quantity * unit_price
      table.timestamps(true, true)
      table.foreign('daily_service_record_id').references('daily_service_records.id')
      table.foreign('meal_category_id').references('meal_categories.id')
    })

    this.db.schema.alterTable('meal_quantities', (table) => {
      table.index(['daily_service_record_id', 'meal_category_id'], 'idx_meal_quantities_daily_service_category')
    })
  }

  async down() {
    this.db.schema.dropTable('meal_quantities')
  }
}