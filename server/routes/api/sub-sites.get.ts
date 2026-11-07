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
    const siteId = query.site_id as string

    // Mock data - in production, query database with user's access
    const subSites = [
      {
        id: '44444444-4444-4444-4444-444444444444',
        site_id: '22222222-2222-2222-2222-222222222222',
        name: 'Tanger - Sous-site 1',
        slug: 'tanger-sous-site-1',
        code: 'TANGER-1',
        is_active: true,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z'
      },
      {
        id: '55555555-5555-5555-5555-555555555555',
        site_id: '22222222-2222-2222-2222-222222222222',
        name: 'Tanger - Sous-site 2',
        slug: 'tanger-sous-site-2',
        code: 'TANGER-2',
        is_active: true,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z'
      },
      {
        id: '66666666-6666-6666-6666-666666666666',
        site_id: '33333333-3333-3333-3333-333333333333',
        name: 'Al Hoceima - Sous-site 1',
        slug: 'al-hoceima-sous-site-1',
        code: 'ALHOCEIMA-1',
        is_active: true,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z'
      }
    ]

    let filtered = subSites
    
    if (siteId) {
      filtered = filtered.filter(s => s.site_id === siteId)
    }

    // Filter based on user role
    if (payload.role === 'sub_site_manager') {
      // Sub-site managers only see their assigned sub-site
      filtered = filtered.filter(s => s.id === '44444444-4444-4444-4444-444444444444')
    } else if (payload.role === 'data_entry') {
      // Data entry users only see their assigned sub-site
      filtered = filtered.filter(s => s.id === '44444444-4444-4444-4444-444444444444')
    } else if (payload.role === 'site_manager') {
      // Site managers see all sub-sites of their site
      filtered = filtered.filter(s => s.site_id === '22222222-2222-2222-2222-222222222222')
    }

    return filtered
  } catch (e) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
})