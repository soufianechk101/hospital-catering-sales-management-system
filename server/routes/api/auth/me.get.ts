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

    // In production, fetch user from database
    const users = [
      {
        id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
        username: 'superadmin',
        email: 'superadmin@medicationing.com',
        full_name: 'Super Administrateur',
        role: 'super_admin'
      },
      {
        id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
        username: 'site.manager.tanger',
        email: 'manager.tanger@medicationing.com',
        full_name: 'Gestionnaire Site Tanger',
        role: 'site_manager'
      },
      {
        id: '11111111-1111-1111-1111-111111111111',
        username: 'subsite.manager.tanger1',
        email: 'manager.tanger1@medicationing.com',
        full_name: 'Gestionnaire Sous-site Tanger 1',
        role: 'sub_site_manager'
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        username: 'data.entry.tanger',
        email: 'dataentry.tanger@medicationing.com',
        full_name: 'Saisie Tanger',
        role: 'data_entry'
      }
    ]

    const user = users.find(u => u.id === payload.userId)
    
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'User not found' })
    }

    return { user }
  } catch (e) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
})