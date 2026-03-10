import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private configService: ConfigService) {
        // 1. Configuramos las llaves maestras
        super({
            clientID: configService.get('GOOGLE_CLIENT_ID')!,
            clientSecret: configService.get('GOOGLE_CLIENT_SECRET')!,
            callbackURL: `${configService.get('HOST_API')}/auth/google/callback`,
            scope: ['email', 'profile'], // Qué permisos le pedimos al usuario
        });
    }

    // 2. Google nos devuelve los datos del usuario logueado en "profile"
    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const { name, emails, id, photos } = profile;

        // "Mapeamos" los datos de Google a cómo nos gusta verlos a nosotros
        const user = {
            googleId: id,
            email: emails[0].value,
            fullName: name.givenName + ' ' + (name.familyName || ''),
            picture: photos[0].value,
            accessToken, // Por si lo quisieras guardar (no solemos hacerlo)
        };

        // done() le dice a Passport: "Ya terminé de revisar, aquí tienes el usuario"
        done(null, user);
    }
}
