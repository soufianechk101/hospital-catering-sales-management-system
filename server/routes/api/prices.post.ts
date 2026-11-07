import { defineHandler } from 'nitro'
import { readBody, createError, getCookie } from 'nitro/h3'

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

    // Only super_admin can manage prices
    if (payload.role !== 'super_admin') {
      throw createError({ statusCode: 403, statusMessage: 'Forbidden: Super Admin access required' })
    }

    const body = await readBody<{ meal_category_id: string; unit_price: number; effective_date: string }>(event)
    
    if (!body?.meal_category_id || !body?.unit_price || !body?.effective_date) {
      throw createError({ statusCode: 400, statusMessage: 'Meal category, unit price, and effective date are required' })
    }

    // In production, save to database
    return {
      id: 'new-price-id',
      meal_category_id: body.meal_category_id,
      unit_price: body.unit_price,
      effective_date: body.effective_date,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  } catch (e) {
    if (e.statusCode) throw e
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
})