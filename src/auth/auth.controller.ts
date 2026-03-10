import { Controller, Get, Post, Body, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';

import { Auth } from './decorators/auth.decorator';
import type { Response } from 'express'
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) { }

  @Post("register")
  create(@Body() createUserDto: createUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post("login")
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get("check-status")
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Este código nunca se ejecuta directamente, AuthGuard('google')
    // se encarga de redirigir al usuario a la página de Google.
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    // Generamos el token usando el servicio actual
    const { token } = await this.authService.googleLogin(req.user);

    // Redirigimos al frontend pasándole el token en la URL
    // Cambiá el puerto 3000 si tu frontend corre en otro
    res.redirect(`${this.configService.get('FRONTEND_URL')}/bookmarks?token=${token}`);
  }


}
