import { query } from "../db";

async function seed() {
  try {
    // Create company
    await query(`INSERT INTO companies (name) VALUES ('MediCatering Pro') ON CONFLICT DO NOTHING`);

    // Create sites
    await query(`INSERT INTO sites (company_id, name, code, city) VALUES (1, 'Tanger', 'TNG', 'Tanger') ON CONFLICT DO NOTHING`);
    await query(`INSERT INTO sites (company_id, name, code, city) VALUES (1, 'Al Hoceima', 'AHC', 'Al Hoceima') ON CONFLICT DO NOTHING`);

    // Create sub-sites for Tanger
    await query(`INSERT INTO sub_sites (site_id, name, code) VALUES (1, 'Sous-site 1', 'TNG-SS1') ON CONFLICT DO NOTHING`);
    await query(`INSERT INTO sub_sites (site_id, name, code) VALUES (1, 'Sous-site 2', 'TNG-SS2') ON CONFLICT DO NOTHING`);

    // Create sub-sites for Al Hoceima
    await query(`INSERT INTO sub_sites (site_id, name, code) VALUES (2, 'Sous-site 1', 'AHC-SS1') ON CONFLICT DO NOTHING`);

    // Create services for Tanger Sous-site 1
    await query(`INSERT INTO services (sub_site_id, name, code) VALUES (1, 'USI', 'USI') ON CONFLICT DO NOTHING`);
    await query(`INSERT INTO services (sub_site_id, name, code) VALUES (1, 'Médecine', 'MED') ON CONFLICT DO NOTHING`);
    await query(`INSERT INTO services (sub_site_id, name, code) VALUES (1, 'Chirurgie', 'CHIR') ON CONFLICT DO NOTHING`);
    await query(`INSERT INTO services (sub_site_id, name, code) VALUES (1, 'Pédiatrie', 'PED') ON CONFLICT DO NOTHING`);

    // Create services for Tanger Sous-site 2
    await query(`INSERT INTO services (sub_site_id, name, code) VALUES (2, 'Réanimation', 'REA') ON CONFLICT DO NOTHING`);
    await query(`INSERT INTO services (sub_site_id, name, code) VALUES (2, 'Autres Services', 'AUT') ON CONFLICT DO NOTHING`);

    // Create services for Al Hoceima Sous-site 1
    await query(`INSERT INTO services (sub_site_id, name, code) VALUES (3, 'USI', 'USI') ON CONFLICT DO NOTHING`);
    await query(`INSERT INTO services (sub_site_id, name, code) VALUES (3, 'Médecine', 'MED') ON CONFLICT DO NOTHING`);

    // Create meal periods
    const mealPeriods = [
      { name: "Petit déjeuner", code: "petit_dejeuner", sort_order: 1 },
      { name: "Déjeuner", code: "dejeuner", sort_order: 2 },
      { name: "Collation", code: "collation", sort_order: 3 },
      { name: "Dîner", code: "diner", sort_order: 4 },
    ];
    for (const mp of mealPeriods) {
      await query(`INSERT INTO meal_periods (name, code, sort_order) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`, [mp.name, mp.code, mp.sort_order]);
    }

    // Create meal categories
    const mealCategories = [
      { name: "Repas malade normal", code: "repas_malade_normal" },
      { name: "Régime hyperprotidique", code: "regime_hyperprotidique" },
      { name: "Régime léger", code: "regime_leger" },
      { name: "Mixé", code: "mixe" },
      { name: "Repas VIP", code: "repas_vip" },
      { name: "Repas Médecine", code: "repas_medecine" },
      { name: "Accompagnant normal", code: "accompagnant_normal" },
      { name: "Accompagnant VIP", code: "accompagnant_vip" },
    ];
    for (const mc of mealCategories) {
      await query(`INSERT INTO meal_categories (name, code) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [mc.name, mc.code]);
    }

    // Create users (passwords are hashed - demo passwords)
    const users = [
      { username: "superadmin", email: "superadmin@medicatering.com", password_hash: "$2b$10$rOzZzZzZzZzZzZzZzZzZzO", full_name: "Super Administrateur", role: "SUPER_ADMIN" },
      { username: "manager_tanger", email: "manager.tanger@medicatering.com", password_hash: "$2b$10$rOzZzZzZzZzZzZzZzZzZzO", full_name: "Responsable Site Tanger", role: "SITE_MANAGER" },
      { username: "manager_ahc", email: "manager.ahc@medicatering.com", password_hash: "$2b$10$rOzZzZzZzZzZzZzZzZzZzO", full_name: "Responsable Site Al Hoceima", role: "SITE_MANAGER" },
      { username: "subsite_manager_1", email: "subsite1@medicatering.com", password_hash: "$2b$10$rOzZzZzZzZzZzZzZzZzZzO", full_name: "Responsable Sous-site 1 Tanger", role: "SUB_SITE_MANAGER" },
      { username: "data_entry_1", email: "dataentry1@medicatering.com", password_hash: "$2b$10$rOzZzZzZzZzZzZzZzZzZzO", full_name: "Saisie Données 1", role: "DATA_ENTRY" },
    ];
    for (const u of users) {
      await query(`INSERT INTO users (username, email, password_hash, full_name, role) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`, [u.username, u.email, u.password_hash, u.full_name, u.role]);
    }

    // Create user site access
    await query(`INSERT INTO user_site_access (user_id, site_id) VALUES (2, 1) ON CONFLICT DO NOTHING`);
    await query(`INSERT INTO user_site_access (user_id, site_id) VALUES (3, 2) ON CONFLICT DO NOTHING`);

    // Create user sub-site access
    await query(`INSERT INTO user_sub_site_access (user_id, sub_site_id) VALUES (4, 1) ON CONFLICT DO NOTHING`);
    await query(`INSERT INTO user_sub_site_access (user_id, sub_site_id) VALUES (5, 1) ON CONFLICT DO NOTHING`);

    console.log("Seed data created successfully");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

seed();