import { Migration } from '@nitro/db'

export default class extends Migration {
  async up() {
    // Seed meal periods
    const periods = [
      { name: 'Petit déjeuner', code: 'breakfast' },
      { name: 'Déjeuner', code: 'lunch' },
      { name: 'Collation', code: 'collation' },
      { name: 'Dîner', code: 'dinner' },
    ]

    for (const period of periods) {
      await this.db.query(
        `INSERT INTO meal_periods (name, code) VALUES ('${period.name}', '${period.code}')`
      )
    }

    // Seed meal categories
    const categories = [
      { name: 'Repas malade normal', code: 'normal', is_accompaniment: false },
      { name: 'Régime hyperprotidique', code: 'hyperprotidique', is_accompaniment: false },
      { name: 'Régime léger', code: 'leger', is_accompaniment: false },
      { name: 'Mixé', code: 'mice', is_accompaniment: false },
      { name: 'Repas VIP', code: 'vip', is_accompaniment: false },
      { name: 'Repas Médecine', code: 'medecine', is_accompaniment: false },
      { name: 'Accompagnant normal', code: 'accompagnant_normal', is_accompaniment: true },
      { name: 'Accompagnant VIP', code: 'accompagnant_vip', is_accompaniment: true },
    ]

    for (const category of categories) {
      await this.db.query(
        `INSERT INTO meal_categories (name, code, is_accompaniment) VALUES ('${category.name}', '${category.code}', ${category.is_accompaniment})`
      )
    }

    // Seed companies
    await this.db.query(`
      INSERT INTO companies (id, name, slug) VALUES
        ('11111111-1111-1111-1111-111111111111', 'MediCatering Pro', 'medicationing-pro')
    `)

    // Seed sites
    await this.db.query(`
      INSERT INTO sites (id, company_id, name, slug) VALUES
        ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Tanger', 'tanger'),
        ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Al Hoceima', 'al-hoceima')
    `)

    // Seed sub-sites
    await this.db.query(`
      INSERT INTO sub_sites (id, site_id, name, slug, code) VALUES
        ('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'Tanger - Sous-site 1', 'tanger-sous-site-1', 'TANGER-1'),
        ('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'Tanger - Sous-site 2', 'tanger-sous-site-2', 'TANGER-2'),
        ('66666666-6666-6666-6666-666666666666', '33333333-3333-3333-3333-333333333333', 'Al Hoceima - Sous-site 1', 'al-hoceima-sous-site-1', 'ALHOCEIMA-1')
    `)

    // Seed services
    await this.db.query(`
      INSERT INTO services (id, sub_site_id, name, code) VALUES
        ('77777777-7777-7777-7777-777777777777', '44444444-4444-4444-4444-444444444444', 'USI', 'USI'),
        ('88888888-8888-8888-8888-888888888888', '44444444-4444-4444-4444-444444444444', 'Médecine', 'MEDECINE'),
        ('99999999-9999-9999-9999-999999999999', '44444444-4444-4444-4444-444444444444', 'Chirurgie', 'CHIRURGIE'),
        ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'Réanimation', 'REANIMATION'),
        ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'Pédiatrie', 'PEDIATRIE'),
        ('cccccccc-cccc-cccc-cccc-cccccccccccc', '55555555-5555-5555-5555-555555555555', 'Réanimation', 'REANIMATION'),
        ('dddddddd-dddd-dddd-dddd-dddddddddddd', '66666666-6666-6666-6666-666666666666', 'USI', 'USI'),
        ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '66666666-6666-6666-6666-666666666666', 'Médecine', 'MEDECINE')
    `)

    // Seed users
    await this.db.query(`
      INSERT INTO users (id, username, email, password_hash, full_name, role, is_active) VALUES
        ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'superadmin', 'superadmin@medicationing.com', '$2b$10$KIXQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQe', 'Super Administrateur', 'super_admin', true),
        ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'site.manager.tanger', 'manager.tanger@medicationing.com', '$2b$10$KIXQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQe', 'Gestionnaire Site Tanger', 'site_manager', true),
        ('11111111-1111-1111-1111-111111111111', 'subsite.manager.tanger1', 'manager.tanger1@medicationing.com', '$2b$10$KIXQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQe', 'Gestionnaire Sous-site Tanger 1', 'sub_site_manager', true),
        ('22222222-2222-2222-2222-222222222222', 'data.entry.tanger', 'dataentry.tanger@medicationing.com', '$2b$10$KIXQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQe', 'Saisie Tanger', 'data_entry', true)
    `)

    // Seed user site access
    await this.db.query(`
      INSERT INTO user_site_access (user_id, site_id, can_manage) VALUES
        ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', true),
        ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333', true),
        ('ffffffff-ffff-ffff-ffff-ffffffffffff', '22222222-2222-2222-2222-222222222222', true)
    `)

    // Seed user sub-site access
    await this.db.query(`
      INSERT INTO user_sub_site_access (user_id, sub_site_id, can_manage) VALUES
        ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '44444444-4444-4444-4444-444444444444', true),
        ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '55555555-5555-5555-5555-555555555555', true),
        ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '66666666-6666-6666-6666-666666666666', true),
        ('ffffffff-ffff-ffff-ffff-ffffffffffff', '44444444-4444-4444-4444-444444444444', true),
        ('ffffffff-ffff-ffff-ffff-ffffffffffff', '55555555-5555-5555-5555-555555555555', true)
    `)

    // Seed prices (test prices in MAD/DH)
    const prices = [
      { category: 'normal', price: 45.00 },
      { category: 'hyperprotidique', price: 65.00 },
      { category: 'leger', price: 50.00 },
      { category: 'mice', price: 55.00 },
      { category: 'vip', price: 80.00 },
      { category: 'medecine', price: 70.00 },
      { category: 'accompagnant_normal', price: 25.00 },
      { category: 'accompagnant_vip', price: 40.00 },
    ]

    for (const p of prices) {
      const category = await this.db.queryOne(
        `SELECT id FROM meal_categories WHERE code = '${p.category}'`
      )
      if (category) {
        await this.db.query(
          `INSERT INTO prices (meal_category_id, unit_price, effective_date) VALUES ('${category.id}', ${p.price}, '2026-01-01')`
        )
      }
    }
  }

  async down() {
    this.db.schema.dropTable('audit_logs')
    this.db.schema.dropTable('sales_lines')
    this.db.schema.dropTable('meal_quantities')
    this.db.schema.dropTable('daily_service_records')
    this.db.schema.dropTable('daily_records')
    this.db.schema.dropTable('price_history')
    this.db.schema.dropTable('prices')
    this.db.schema.dropTable('user_sub_site_access')
    this.db.schema.dropTable('user_site_access')
    this.db.schema.dropTable('users')
    this.db.schema.dropTable('roles')
    this.db.schema.dropTable('audit_logs')
    this.db.schema.dropTable('sales_lines')
    this.db.schema.dropTable('meal_quantities')
    this.db.schema.dropTable('daily_service_records')
    this.db.schema.dropTable('daily_records')
    this.db.schema.dropTable('price_history')
    this.db.schema.dropTable('prices')
    this.db.schema.dropTable('user_sub_site_access')
    this.db.schema.dropTable('user_site_access')
    this.db.schema.dropTable('users')
    this.db.schema.dropTable('roles')
    this.db.schema.dropTable('meal_categories')
    this.db.schema.dropTable('meal_periods')
    this.db.schema.dropTable('services')
    this.db.schema.dropTable('sub_sites')
    this.db.schema.dropTable('sites')
    this.db.schema.dropTable('companies')
  }
}