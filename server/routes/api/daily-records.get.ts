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
    const subSiteId = query.sub_site_id as string
    const date = query.date as string

    // Mock data - in production, query database with user's access
    const dailyRecords = [
      {
        id: 'rec-1',
        sub_site_id: '44444444-4444-4444-4444-444444444444',
        sub_site_name: 'Tanger - Sous-site 1',
        user_id: '22222222-2222-2222-2222-222222222222',
        user_name: 'Saisie Tanger',
        record_date: '2026-11-01',
        passage_global: 100,
        total_revenue: 4500.00,
        is_validated: false,
        created_at: '2026-11-01T08:00:00Z',
        updated_at: '2026-11-01T08:00:00Z'
      },
      {
        id: 'rec-2',
        sub_site_id: '44444444-4444-4444-4444-444444444444',
        sub_site_name: 'Tanger - Sous-site 1',
        user_id: '22222222-2222-2222-2222-222222222222',
        user_name: 'Saisie Tanger',
        record_date: '2026-11-02',
        passage_global: 120,
        total_revenue: 5400.00,
        is_validated: false,
        created_at: '2026-11-02T08:00:00Z',
        updated_at: '2026-11-02T08:00:00Z'
      }
    ]

    let filtered = dailyRecords
    
    if (subSiteId) {
      filtered = filtered.filter(r => r.sub_site_id === subSiteId)
    }

    if (date) {
      filtered = filtered.filter(r => r.record_date === date)
    }

    // Filter based on user role
    if (payload.role === 'sub_site_manager') {
      filtered = filtered.filter(r => r.sub_site_id === '44444444-4444-4444-4444-444444444444')
    } else if (payload.role === 'data_entry') {
      filtered = filtered.filter(r => r.sub_site_id === '44444444-4444-4444-4444-444444444444')
    } else if (payload.role === 'site_manager') {
      filtered = filtered.filter(r => 
        r.sub_site_id === '44444444-4444-4444-4444-444444444444' || 
        r.sub_site_id === '55555555-5555-5555-5555-555555555555'
      )
    }

    return filtered
  } catch (e) {
    if (e.statusCode) throw e
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
})