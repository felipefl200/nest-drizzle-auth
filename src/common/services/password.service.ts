import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { compare, hash } from 'bcrypt'

@Injectable()
export class PasswordService {
  private readonly SALT_ROUNDS: number
  /**
   * Construtor da classe PasswordService
   * @param configService - Serviço de configuração do NestJS
   */
  constructor(private configService: ConfigService) {
    // Obtém o valor do .env e converte para número
    // Usa 12 como fallback se não estiver definido
    this.SALT_ROUNDS = Number(this.configService.get<string>('SALT_ROUNDS', '12'))
  }

  /**
   * Gera um hash seguro da senha
   */
  async hash(password: string): Promise<string> {
    return hash(password, this.SALT_ROUNDS)
  }

  /**
   * Verifica se a senha fornecida corresponde ao hash armazenado
   */
  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword)
  }
}
