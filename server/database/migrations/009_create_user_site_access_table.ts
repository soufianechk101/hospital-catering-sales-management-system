import { Migration } from '@nitro/db'

export default class extends Migration {
  async up() {
    this.db.schema.createTable('user_site_access', (table) => {
      table.uuid('id').primary()
      table.uuid('user_id').notNull()
      table.uuid('site_id').notNull()
      table.boolean('can_manage').default(false)
      table.timestamps(true, true)
      table.unique(['user_id', 'site_id'])
      table.foreign('user_id').references('users.id')
      table.foreign('site_id').references('sites.id')
    })
  }

  async down() {
    this.db.schema.dropTable('user_site_access')
  }
}