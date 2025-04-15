import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class ExcludePasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Função recursiva para remover o campo password de objetos aninhados
        const removePassword = (obj: unknown): unknown => {
          if (Array.isArray(obj)) {
            return obj.map((item) => removePassword(item))
          }

          if (obj !== null && typeof obj === 'object') {
            const result = { ...obj }
            if ('password' in result) {
              delete result.password
            }

            // Processa propriedades aninhadas
            Object.keys(result).forEach((key) => {
              if (typeof result[key] === 'object' && result[key] !== null) {
                result[key] = removePassword(result[key])
              }
            })

            return result
          }

          return obj
        }

        return removePassword(data)
      })
    )
  }
}
