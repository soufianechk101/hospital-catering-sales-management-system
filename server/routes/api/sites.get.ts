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

    // Mock data - in production, query database with user's access
    const sites = [
      {
        id: '22222222-2222-2222-2222-222222222222',
        company_id: '11111111-1111-1111-1111-111111111111',
        name: 'Tanger',
        slug: 'tanger',
        timezone: 'Africa/Casablanca',
        is_active: true,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z'
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        company_id: '11111111-1111-1111-1111-111111111111',
        name: 'Al Hoceima',
        slug: 'al-hoceima',
        timezone: 'Africa/Casablanca',
        is_active: true,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z'
      }
    ]

    // Filter based on user role
    if (payload.role === 'site_manager') {
      // Site managers only see their assigned site
      return sites.filter(s => s.id === '22222222-2222-2222-2222-222222222222')
    }

    return sites
  } catch (e) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
})