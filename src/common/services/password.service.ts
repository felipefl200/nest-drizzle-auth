import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcrypt'

@Injectable()
export class PasswordService {
  // Número de rounds para gerar o salt
  // 12 é um bom equilíbrio entre segurança e performance
  private readonly SALT_ROUNDS = 12

  constructor() {
    console.log(`SALT_ROUNDS: ${this.SALT_ROUNDS}`)
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
