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

    // Mock data - in production, query database with user's access
    const services = [
      {
        id: '77777777-7777-7777-7777-777777777777',
        sub_site_id: '44444444-4444-4444-4444-444444444444',
        name: 'USI',
        code: 'USI',
        is_active: true,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z'
      },
      {
        id: '88888888-8888-8888-8888-888888888888',
        sub_site_id: '44444444-4444-4444-4444-444444444444',
        name: 'Médecine',
        code: 'MEDECINE',
        is_active: true,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z'
      },
      {
        id: '99999999-9999-9999-9999-999999999999',
        sub_site_id: '44444444-4444-4444-4444-444444444444',
        name: 'Chirurgie',
        code: 'CHIRURGIE',
        is_active: true,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z'
      },
      {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        sub_site_id: '44444444-4444-4444-4444-444444444444',
        name: 'Réanimation',
        code: 'REANIMATION',
        is_active: true,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z'
      },
      {
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        sub_site_id: '44444444-4444-4444-4444-444444444444',
        name: 'Pédiatrie',
        code: 'PEDIATRIE',
        is_active: true,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z'
      },
      {
        id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
        sub_site_id: '55555555-5555-5555-5555-555555555555',
        name: 'Réanimation',
        code: 'REANIMATION',
        is_active: true,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z'
      },
      {
        id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
        sub_site_id: '66666666-6666-6666-6666-666666666666',
        name: 'USI',
        code: 'USI',
        is_active: true,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z'
      },
      {
        id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
        sub_site_id: '66666666-6666-6666-6666-666666666666',
        name: 'Médecine',
        code: 'MEDECINE',
        is_active: true,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z'
      }
    ]

    let filtered = services
    
    if (subSiteId) {
      filtered = filtered.filter(s => s.sub_site_id === subSiteId)
    }

    // Filter based on user role
    if (payload.role === 'sub_site_manager') {
      filtered = filtered.filter(s => s.sub_site_id === '44444444-4444-4444-4444-444444444444')
    } else if (payload.role === 'data_entry') {
      filtered = filtered.filter(s => s.sub_site_id === '44444444-4444-4444-4444-444444444444')
    } else if (payload.role === 'site_manager') {
      filtered = filtered.filter(s => 
        s.sub_site_id === '44444444-4444-4444-4444-444444444444' || 
        s.sub_site_id === '55555555-5555-5555-5555-555555555555'
      )
    }

    return filtered
  } catch (e) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
})