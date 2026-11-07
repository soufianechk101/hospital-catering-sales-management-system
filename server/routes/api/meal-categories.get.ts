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
    const mealCategories = [
      { id: '1', name: 'Repas malade normal', code: 'normal', is_accompaniment: false, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
      { id: '2', name: 'Régime hyperprotidique', code: 'hyperprotidique', is_accompaniment: false, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
      { id: '3', name: 'Régime léger', code: 'leger', is_accompaniment: false, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
      { id: '4', name: 'Mixé', code: 'mice', is_accompaniment: false, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
      { id: '5', name: 'Repas VIP', code: 'vip', is_accompaniment: false, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
      { id: '6', name: 'Repas Médecine', code: 'medecine', is_accompaniment: false, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
      { id: '7', name: 'Accompagnant normal', code: 'accompagnant_normal', is_accompaniment: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
      { id: '8', name: 'Accompagnant VIP', code: 'accompagnant_vip', is_accompaniment: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' }
    ]

    return mealCategories
  } catch (e) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
})