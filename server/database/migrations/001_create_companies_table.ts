import { Migration } from '@nitro/db'

export default class extends Migration {
  async up() {
    this.db.schema.createTable('companies', (table) => {
      table.uuid('id').primary()
      table.string('name').notNull()
      table.string('slug').notNull().unique()
      table.string('logo_url')
      table.string('primary_color').default('#1261A0')
      table.string('background_color').default('#F5F8FC')
      table.timestamps(true, true)
    })
  }

  async down() {
    this.db.schema.dropTable('companies')
  }
}