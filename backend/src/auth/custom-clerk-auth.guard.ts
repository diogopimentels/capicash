import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { ClerkAuthGuard } from '../modules/auth/clerk-auth.guard'; // Ajustado para o caminho do Guard local, já que 'clerk-auth-nestjs' não está instalado

@Injectable()
export class CustomClerkAuthGuard extends ClerkAuthGuard implements CanActivate {


    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        // SOLUÇÃO: Se for OPTIONS (CORS Preflight), libera o acesso imediatamente
        if (request.method === 'OPTIONS') {
            return true;
        }

        // Para os outros métodos (POST, GET, etc), segue a validação padrão do Clerk
        return super.canActivate(context);
    }
}
