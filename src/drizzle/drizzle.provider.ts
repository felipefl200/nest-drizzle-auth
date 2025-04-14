import { ConfigService } from '@nestjs/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

export const DrizzleDB = 'DrizzleDB'

export const drizzleProvider = [
  {
    provide: DrizzleDB,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const connectionString = configService.get<string>('DATABASE_URL')
      const pool = new Pool({
        connectionString
      })
      return drizzle(pool, { schema })
    }
  }
]
