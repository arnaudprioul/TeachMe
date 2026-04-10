import { Redis } from 'ioredis'

let _client: Redis | null = null

export function getRedis(): Redis {
  if (!_client) {
    _client = new Redis(process.env.REDIS_URL ?? 'redis://localhost:5379', {
      lazyConnect: false,
      maxRetriesPerRequest: 3,
    })
  }
  return _client
}
