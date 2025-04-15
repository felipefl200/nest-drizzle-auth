import { Inject, Injectable } from '@nestjs/common'
import { eq, isNull } from 'drizzle-orm'
import { PasswordService } from 'src/common/services/password.service'
import { DrizzleDB } from 'src/drizzle/drizzle.provider'
import { comments, groupMembers, posts, profileInfo, users } from 'src/drizzle/schema'
import { DrizzleDBType } from 'src/drizzle/types/drizzle'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
  constructor(
    @Inject(DrizzleDB) private readonly db: DrizzleDBType,
    private readonly passwordService: PasswordService
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await this.passwordService.hash(createUserDto.password)

    const userWithHashedPassword = {
      ...createUserDto,
      password: hashedPassword
    }

    // Verifica se o email já esta cadastrado
    const existingUser = await this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, createUserDto.email)
    })

    if (existingUser) {
      throw new Error('User already exists')
    }

    return await this.db.insert(users).values(userWithHashedPassword).returning()
  }

  async findAll() {
    return await this.db.query.users.findMany({
      orderBy: (users) => users.id,
      where: (users) => isNull(users.deletedAt)
    })
  }

  async findOne(id: number) {
    const user = await this.db.query.users.findFirst({
      where: (users, { eq, and }) => and(eq(users.id, id), isNull(users.deletedAt))
    })
    if (!user) return null

    return user
  }

  async findByEmail(email: string) {
    const user = await this.db.query.users.findFirst({
      where: (users, { eq, and }) => and(eq(users.email, email), isNull(users.deletedAt))
    })
    if (!user) return null
    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.db.query.users.findFirst({
      where: (users, { eq, and }) => and(eq(users.id, id), isNull(users.deletedAt))
    })

    if (!user) return null

    // Se uma nova senha foi fornecida, hash antes de atualizar
    if (updateUserDto.password) {
      updateUserDto.password = await this.passwordService.hash(updateUserDto.password)
    }

    const updatedUsers = await this.db.update(users).set(updateUserDto).where(eq(users.id, id)).returning()

    if (updatedUsers.length === 0) {
      return null
    }

    return updatedUsers[0]
  }

  async remove(id: number) {
    const user = await this.db.query.users.findFirst({
      where: (users, { eq, and }) => and(eq(users.id, id), isNull(users.deletedAt))
    })

    if (!user) return null
    //Soft delete
    const deletedUsers = await this.db.update(users).set({ deletedAt: new Date() }).where(eq(users.id, id)).returning()

    if (deletedUsers.length === 0) return null

    return deletedUsers[0]
  }

  async hardRemove(id: number) {
    const user = await this.db.query.users.findFirst({
      where: (users, { eq, and }) => and(eq(users.id, id), isNull(users.deletedAt))
    })
    if (!user) return null

    return await this.db.transaction(async (tx) => {
      // 1. Excluir registros da tabela group_members que referenciam este usuário
      await tx.delete(groupMembers).where(eq(groupMembers.userId, id))

      // 2. Encontrar todos os posts do usuário
      const userPosts = await tx.query.posts.findMany({
        where: (posts, { eq }) => eq(posts.authorId, id)
      })

      // 3. Para cada post do usuário, excluir todos os comentários relacionados
      for (const post of userPosts) {
        await tx.delete(comments).where(eq(comments.postId, post.id))
      }

      // 4. Excluir os comentários feitos pelo usuário em posts de outras pessoas
      await tx.delete(comments).where(eq(comments.authorId, id))

      // 5. Excluir os posts do usuário
      await tx.delete(posts).where(eq(posts.authorId, id))

      // 6. Se houver outras tabelas relacionadas (como profileInfo), excluir também
      if (profileInfo) {
        await tx.delete(profileInfo).where(eq(profileInfo.userId, id))
      }

      // 7. Finalmente, excluir o usuário
      const deletedUsers = await tx.delete(users).where(eq(users.id, id)).returning()

      if (deletedUsers.length === 0) return null

      return deletedUsers[0]
    })
  }
}
