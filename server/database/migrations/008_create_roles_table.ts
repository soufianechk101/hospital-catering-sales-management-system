import { Migration } from '@nitro/db'

export default class extends Migration {
  async up() {
    this.db.schema.createTable('roles', (table) => {
      table.uuid('id').primary()
      table.string('name').notNull() // super_admin, site_manager, sub_site_manager, data_entry
      table.string('display_name').notNull()
      table.text('permissions').notNull() // JSON string of permissions
      table.boolean('is_default').default(false)
      table.timestamps(true, true)
    })

    // Insert default roles
    await this.db.query(`
      INSERT INTO roles (name, display_name, permissions, is_default) VALUES
        ('super_admin', 'Super Administrateur', '{"all": true}', true),
        ('site_manager', 'Gestionnaire de Site', '{"view_site": true, "manage_sub_sites": true, "manage_services": true, "view_journals": true, "manage_prices": true}', false),
        ('sub_site_manager', 'Gestionnaire de Sous-site', '{"view_sub_site": true, "manage_services": true, "enter_data": true, "view_journals": true}', false),
        ('data_entry', 'Saisie de Données', '{"enter_data": true, "view_own_records": true}', false)
    `)
  }

  async down() {
    this.db.schema.dropTable('roles')
  }
}