import { Migration } from '@nitro/db'

export default class extends Migration {
  async up() {
    this.db.schema.createTable('sub_sites', (table) => {
      table.uuid('id').primary()
      table.uuid('site_id').notNull()
      table.string('name').notNull()
      table.string('slug').notNull()
      table.string('code').notNull() // e.g., 'TANGER-1', 'ALHOCEIMA-1'
      table.boolean('is_active').default(true)
      table.timestamps(true, true)
      table.foreign('site_id').references('sites.id')
      table.unique(['site_id', 'slug'])
    })
  }

  async down() {
    this.db.schema.dropTable('sub_sites')
  }
}