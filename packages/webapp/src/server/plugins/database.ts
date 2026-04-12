import { initDb } from '../db/connection'

export default defineNitroPlugin(async () => {
  await initDb()
  console.log('[DB] Ready')
})
