import { Migration } from '@nitro/db'

export default class extends Migration {
  async up() {
    this.db.schema.createTable('meal_categories', (table) => {
      table.uuid('id').primary()
      table.string('name').notNull() // Repas malade normal, Régime hyperprotidique, etc.
      table.string('code').notNull() // normal, hyperprotidique, leger, mixé, vip, médecine, accompagnant_normal, accompagnant_vip
      table.boolean('is_accompaniment').default(false) // Whether this category is an accompaniment
      table.timestamps(true, true)
    })
  }

  async down() {
    this.db.schema.dropTable('meal_categories')
  }
}