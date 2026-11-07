import { Migration } from '@nitro/db'

export default class extends Migration {
  async up() {
    this.db.schema.createTable('services', (table) => {
      table.uuid('id').primary()
      table.uuid('sub_site_id').nullable()
      table.string('name').notNull()
      table.string('code').notNull() // e.g., 'USI', 'MEDECINE', 'CHIRURGIE'
      table.boolean('is_active').default(true)
      table.timestamps(true, true)
      table.foreign('sub_site_id').references('sub_sites.id')
      table.unique(['sub_site_id', 'code'])
    })
  }

  async down() {
    this.db.schema.dropTable('services')
  }
}