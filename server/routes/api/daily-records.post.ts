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

    const body = await readBody<{
      sub_site_id: string
      record_date: string
      passage_global: number
      services: Array<{
        service_id: string
        meal_period_id: string
        passage_global: number
        meal_quantities: Array<{
          meal_category_id: string
          quantity: number
          unit_price: number
          revenue: number
        }>
      }>
    }>(event)
    
    if (!body?.sub_site_id || !body?.record_date || !body?.services) {
      throw createError({ statusCode: 400, statusMessage: 'Sub-site, date, and services are required' })
    }

    // Calculate totals
    let totalRevenue = 0
    let totalPassage = 0

    for (const service of body.services) {
      totalPassage += service.passage_global
      for (const mq of service.meal_quantities) {
        totalRevenue += mq.revenue
      }
    }

    // In production, save to database with transaction
    return {
      id: 'new-record-id',
      sub_site_id: body.sub_site_id,
      user_id: payload.userId,
      record_date: body.record_date,
      passage_global: totalPassage,
      total_revenue: totalRevenue,
      is_validated: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  } catch (e) {
    if (e.statusCode) throw e
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
})