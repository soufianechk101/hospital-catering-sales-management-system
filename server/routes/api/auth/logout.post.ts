import { defineHandler } from 'nitro'
import { deleteCookie } from 'nitro/h3'

export default defineHandler(async (event) => {
  deleteCookie(event, 'auth_token')
  return { success: true }
})