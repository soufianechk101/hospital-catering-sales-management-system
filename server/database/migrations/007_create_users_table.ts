import { Migration } from '@nitro/db'
import { hash } from '@node-rs/bcrypt'

export default class extends Migration {
  async up() {
    this.db.schema.createTable('users', (table) => {
      table.uuid('id').primary()
      table.string('username').notNull().unique()
      table.string('email').notNull().unique()
      table.string('password_hash').notNull()
      table.string('full_name').notNull()
      table.string('role').notNull() // super_admin, site_manager, sub_site_manager, data_entry
      table.boolean('is_active').default(true)
      table.string('last_login_ip')
      table.string('last_login_at')
      table.timestamps(true, true)
    })
  }

  async down() {
    this.db.schema.dropTable('users')
  }
}