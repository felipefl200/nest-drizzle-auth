import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PasswordService } from 'src/common/services/password.service'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService
  ) {}

  /**
   * Valida as credenciais do usuário
   * @param email - Email do usuário
   * @param password - Senha do usuário
   * @returns Dados do usuário sem a senha se válido, ou null se inválido
   */
  async validateUser(email: string, password: string): Promise<any> {
    try {
      // 1. Busca o usuário pelo email
      const user = await this.usersService.findByEmail(email)
      if (!user) return null

      // 2. Valida a senha usando o serviço de senha
      const isPasswordValid = await this.passwordService.compare(password, user.password)
      if (!isPasswordValid) return null

      return user
    } catch {
      // 4. Tratamento de erro adequado sem expor detalhes internos
      throw new UnauthorizedException('Invalid authentication attempt')
    }
  }
}
