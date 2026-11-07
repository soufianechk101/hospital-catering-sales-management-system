import { Migration } from '@nitro/db'

export default class extends Migration {
  async up() {
    this.db.schema.createTable('user_sub_site_access', (table) => {
      table.uuid('id').primary()
      table.uuid('user_id').notNull()
      table.uuid('sub_site_id').notNull()
      table.boolean('can_manage').default(false)
      table.timestamps(true, true)
      table.unique(['user_id', 'sub_site_id'])
      table.foreign('user_id').references('users.id')
      table.foreign('sub_site_id').references('sub_sites.id')
    })
  }

  async down() {
    this.db.schema.dropTable('user_sub_site_access')
  }
}