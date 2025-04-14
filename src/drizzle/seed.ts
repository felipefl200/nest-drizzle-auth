import { faker } from '@faker-js/faker/locale/pt_BR'
import { randomInt } from 'crypto'
import 'dotenv/config'
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

const db = drizzle(pool, { schema }) as NodePgDatabase<typeof schema>

async function main() {
  //Seeding the database with 50 users
  const allUsers = await Promise.all(
    Array.from({ length: 50 }).map(async () => {
      const [user] = await db
        .insert(schema.users)
        .values({
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: faker.internet.password()
        })
        .returning()
      return user
    })
  )

  //Seeding the database with 50 profileInfos
  await Promise.all(
    allUsers.map(async (user) => {
      await db.insert(schema.profileInfo).values({
        userId: user.id,
        metadata: {
          bio: faker.lorem.sentence(),
          location: faker.location.city(),
          website: faker.internet.url(),
          age: faker.number.int({ min: 18, max: 65 }),
          interests: faker.helpers.arrayElements(
            ['tecnologias', 'musicas', 'esportes', 'filmes', 'artes', 'viagens'],
            faker.number.int({ min: 1, max: 3 })
          )
        }
      })
    })
  )

  //Seeding the database with 50 posts
  const allPosts = await Promise.all(
    Array.from({ length: 50 }).map(async () => {
      const [post] = await db
        .insert(schema.posts)
        .values({
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraph(),
          authorId: faker.helpers.arrayElement(allUsers).id
        })
        .returning()
      return post
    })
  )

  //Seeding the database with 120 comments
  await Promise.all(
    Array.from({ length: 120 }).map(async () => {
      const [comment] = await db
        .insert(schema.comments)
        .values({
          text: faker.lorem.paragraph(),
          postId: faker.helpers.arrayElement(allPosts).id,
          authorId: faker.helpers.arrayElement(allUsers).id
        })
        .returning()
      return comment
    })
  )

  const roles = schema.groupRoleEnum.enumValues
  type GroupRole = (typeof roles)[number]

  //Seeding the database with groups from groupRoleEnum
  const allGroups = await Promise.all(
    roles.map(async (role: GroupRole) => {
      const [group] = await db
        .insert(schema.groups)
        .values({
          name: faker.lorem.words(randomInt(1, 3)),
          role
        })
        .returning()
      return group
    })
  )

  // Joining users to groups
  await Promise.all(
    allUsers.map(async (user) => {
      const groupId = faker.helpers.arrayElement(allGroups).id
      await db
        .insert(schema.groupMembers)
        .values({
          groupId,
          userId: user.id
        })
        .returning()
    })
  )
}

async function runSeed() {
  try {
    await main()
    console.log('Seeding completed 🌱')
  } catch (error) {
    console.error('🚨 Error seeding database:', error)
  } finally {
    console.log('🛑 Closing database connection')
    await pool.end()
  }
}

void runSeed()
