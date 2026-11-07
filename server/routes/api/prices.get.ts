import { defineHandler } from 'nitro'
import { getCookie, createError } from 'nitro/h3'

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

    // Mock data - in production, query database
    const prices = [
      { id: '1', meal_category_id: '1', meal_category_name: 'Repas malade normal', unit_price: 45.00, effective_date: '2026-01-01', is_active: true },
      { id: '2', meal_category_id: '2', meal_category_name: 'Régime hyperprotidique', unit_price: 65.00, effective_date: '2026-01-01', is_active: true },
      { id: '3', meal_category_id: '3', meal_category_name: 'Régime léger', unit_price: 50.00, effective_date: '2026-01-01', is_active: true },
      { id: '4', meal_category_id: '4', meal_category_name: 'Mixé', unit_price: 55.00, effective_date: '2026-01-01', is_active: true },
      { id: '5', meal_category_id: '5', meal_category_name: 'Repas VIP', unit_price: 80.00, effective_date: '2026-01-01', is_active: true },
      { id: '6', meal_category_id: '6', meal_category_name: 'Repas Médecine', unit_price: 70.00, effective_date: '2026-01-01', is_active: true },
      { id: '7', meal_category_id: '7', meal_category_name: 'Accompagnant normal', unit_price: 25.00, effective_date: '2026-01-01', is_active: true },
      { id: '8', meal_category_id: '8', meal_category_name: 'Accompagnant VIP', unit_price: 40.00, effective_date: '2026-01-01', is_active: true }
    ]

    return prices
  } catch (e) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
})