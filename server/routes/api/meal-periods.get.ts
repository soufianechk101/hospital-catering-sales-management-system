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
    const mealPeriods = [
      { id: '1', name: 'Petit déjeuner', code: 'breakfast', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
      { id: '2', name: 'Déjeuner', code: 'lunch', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
      { id: '3', name: 'Collation', code: 'collation', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
      { id: '4', name: 'Dîner', code: 'dinner', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' }
    ]

    return mealPeriods
  } catch (e) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
})