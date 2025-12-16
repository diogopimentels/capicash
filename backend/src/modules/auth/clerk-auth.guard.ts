import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../shared/decorators/public.decorator';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
    private readonly logger = new Logger(ClerkAuthGuard.name);

    constructor(private reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();

        // SOLUÇÃO CRÍTICA: Permitir Preflight de CORS sem token
        if (request.method === 'OPTIONS') {
            return true;
        }

        const authHeader = request.headers.authorization;

        if (!authHeader) {
            this.logger.error('Missing Authorization Header');
            throw new UnauthorizedException('Missing Authorization Header');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            this.logger.error('Invalid Token Format');
            throw new UnauthorizedException('Invalid Token Format');
        }

        try {
            // Decode JWT payload (middle part)
            const base64Url = token.split('.')[1];
            if (!base64Url) {
                throw new Error('Invalid JWT structure');
            }

            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
            const payload = JSON.parse(jsonPayload);

            if (!payload.sub) {
                throw new Error('Missing sub in payload');
            }

            // this.logger.log(`User Authenticated: ${payload.sub}`);
            request.user = { id: payload.sub };
            return true;
        } catch (e) {
            this.logger.error(`Token validation failed: ${e.message}`);
            // Fallback for testing with raw ID if needed, but for now let's be strict or debug
            // request.user = { id: token }; 
            throw new UnauthorizedException('Invalid Token');
        }
    }
}