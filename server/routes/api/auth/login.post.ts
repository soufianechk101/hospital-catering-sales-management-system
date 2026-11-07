import { defineHandler } from 'nitro'
import { readBody, createError, setCookie } from 'nitro/h3'
import { hash, verify } from '@node-rs/bcrypt'

export default defineHandler(async (event) => {
  const body = await readBody<{ username: string; password: string }>(event)
  
  if (!body?.username || !body?.password) {
    throw createError({ statusCode: 400, statusMessage: 'Username and password are required' })
  }

  // In a real app, this would query the database
  // For now, we'll use a mock implementation
  const users = [
    {
      id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
      username: 'superadmin',
      email: 'superadmin@medicationing.com',
      password_hash: '$2b$10$KIXQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQe',
      full_name: 'Super Administrateur',
      role: 'super_admin',
      is_active: true
    },
    {
      id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
      username: 'site.manager.tanger',
      email: 'manager.tanger@medicationing.com',
      password_hash: '$2b$10$KIXQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQe',
      full_name: 'Gestionnaire Site Tanger',
      role: 'site_manager',
      is_active: true
    },
    {
      id: '11111111-1111-1111-1111-111111111111',
      username: 'subsite.manager.tanger1',
      email: 'manager.tanger1@medicationing.com',
      password_hash: '$2b$10$KIXQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQe',
      full_name: 'Gestionnaire Sous-site Tanger 1',
      role: 'sub_site_manager',
      is_active: true
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      username: 'data.entry.tanger',
      email: 'dataentry.tanger@medicationing.com',
      password_hash: '$2b$10$KIXQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQeQe',
      full_name: 'Saisie Tanger',
      role: 'data_entry',
      is_active: true
    }
  ]

  const user = users.find(u => u.username === body.username)
  
  if (!user || !user.is_active) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  // In production, use verify(password, user.password_hash)
  // For demo, we'll accept 'password' for all users
  const isValid = body.password === 'password'
  
  if (!isValid) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  // Create session token (in production, use JWT)
  const token = Buffer.from(JSON.stringify({
    userId: user.id,
    username: user.username,
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  })).toString('base64')

  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 // 24 hours
  })

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.full_name,
      role: user.role
    },
    token
  }
})