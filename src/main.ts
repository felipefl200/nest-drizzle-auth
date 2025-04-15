import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ExcludePasswordInterceptor } from './common/interceptors/exclude-password.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalInterceptors(new ExcludePasswordInterceptor())
  await app.listen(process.env.PORT ?? 3000)
}
void bootstrap()
