import { defineHandler } from 'nitro'
import { getCookie, createError, getQuery } from 'nitro/h3'

export default defineHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
  }

  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString())
    
    if (payload.exp < Date.now()) {
      throw createError({ statusCode: 401, statusMessage: 'Token expired' })
    }

    const query = getQuery(event)
    const dateRange = query.date_range as string || 'today'

    // Mock dashboard stats - in production, query database with user's access
    const stats = {
      daily_revenue: 4500.00,
      monthly_revenue: 135000.00,
      total_meals: 1250,
      total_passages: 1250,
      active_services: 5,
      sub_sites: 3,
      sites: 2,
      revenue_by_day: [
        { date: '2026-10-25', revenue: 4200 },
        { date: '2026-10-26', revenue: 4500 },
        { date: '2026-10-27', revenue: 4800 },
        { date: '2026-10-28', revenue: 4600 },
        { date: '2026-10-29', revenue: 4900 },
        { date: '2026-10-30', revenue: 5100 },
        { date: '2026-10-31', revenue: 4700 }
      ],
      revenue_by_site: [
        { site: 'Tanger', revenue: 90000 },
        { site: 'Al Hoceima', revenue: 45000 }
      ],
      revenue_by_sub_site: [
        { sub_site: 'Tanger - Sous-site 1', revenue: 60000 },
        { sub_site: 'Tanger - Sous-site 2', revenue: 30000 },
        { sub_site: 'Al Hoceima - Sous-site 1', revenue: 45000 }
      ],
      revenue_by_service: [
        { service: 'USI', revenue: 35000 },
        { service: 'Médecine', revenue: 28000 },
        { service: 'Chirurgie', revenue: 25000 },
        { service: 'Réanimation', revenue: 22000 },
        { service: 'Pédiatrie', revenue: 25000 }
      ],
      revenue_by_meal_period: [
        { period: 'Petit déjeuner', revenue: 35000 },
        { period: 'Déjeuner', revenue: 45000 },
        { period: 'Collation', revenue: 25000 },
        { period: 'Dîner', revenue: 30000 }
      ],
      meal_category_distribution: [
        { category: 'Repas malade normal', quantity: 400 },
        { category: 'Régime hyperprotidique', quantity: 150 },
        { category: 'Régime léger', quantity: 100 },
        { category: 'Mixé', quantity: 80 },
        { category: 'Repas VIP', quantity: 120 },
        { category: 'Repas Médecine', quantity: 90 },
        { category: 'Accompagnant normal', quantity: 180 },
        { category: 'Accompagnant VIP', quantity: 130 }
      ]
    }

    return stats
  } catch (e) {
    if (e.statusCode) throw e
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
})