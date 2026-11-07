import { Migration } from '@nitro/db'

export default class extends Migration {
  async up() {
    this.db.schema.createTable('sites', (table) => {
      table.uuid('id').primary()
      table.uuid('company_id').notNull()
      table.string('name').notNull()
      table.string('slug').notNull()
      table.string('timezone').default('Africa/Casablanca')
      table.boolean('is_active').default(true)
      table.timestamps(true, true)
      table.foreign('company_id').references('companies.id')
    })
  }

  async down() {
    this.db.schema.dropTable('sites')
  }
}