import { Migration } from '@nitro/db'

export default class extends Migration {
  async up() {
    this.db.schema.createTable('prices', (table) => {
      table.uuid('id').primary()
      table.uuid('meal_category_id').notNull()
      table.decimal('unit_price', 10, 2).notNull() // in MAD/DH
      table.date('effective_date').notNull()
      table.boolean('is_active').default(true)
      table.timestamps(true, true)
      table.foreign('meal_category_id').references('meal_categories.id')
      table.unique(['meal_category_id', 'effective_date'])
    })

    // Create index for quick lookups
    this.db.schema.alterTable('prices', (table) => {
      table.index(['meal_category_id', 'effective_date'], 'idx_prices_category_date')
    })
  }

  async down() {
    this.db.schema.dropTable('prices')
  }
}