import { Migration } from '@nitro/db'

export default class extends Migration {
  async up() {
    this.db.schema.createTable('meal_periods', (table) => {
      table.uuid('id').primary()
      table.string('name').notNull() // Petit déjeuner, Déjeuner, Collation, Dîner
      table.string('code').notNull() // breakfast, lunch, collation, dinner
      table.timestamps(true, true)
    })
  }

  async down() {
    this.db.schema.dropTable('meal_periods')
  }
}