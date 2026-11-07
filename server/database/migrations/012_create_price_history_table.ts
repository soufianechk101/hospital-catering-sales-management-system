import { Migration } from '@nitro/db'

export default class extends Migration {
  async up() {
    this.db.schema.createTable('price_history', (table) => {
      table.uuid('id').primary()
      table.uuid('price_id').notNull()
      table.decimal('unit_price', 10, 2).notNull()
      table.date('effective_date').notNull()
      table.string('changed_by').notNull()
      table.timestamps(true, true)
      table.foreign('price_id').references('prices.id')
    })

    this.db.schema.alterTable('price_history', (table) => {
      table.index(['price_id', 'effective_date'], 'idx_price_history_category_date')
    })
  }

  async down() {
    this.db.schema.dropTable('price_history')
  }
}