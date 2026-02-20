import { Controller, Get, Post, Body, UseGuards, Req, Headers, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RawHeaders } from './decorators/raw-headers.decorator';
import * as http from 'http';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces/valid-roles';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

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
  async googleAuthRedirect(@Req() req: any) {
    // Cuando Google nos devuelve aquí, el AuthGuard ya hizo su trabajo con la strategy
    // y nos dejó los datos del usuario listos en 'req.user'

    // Le pasamos estos datos a nuestro servicio para que los guarde en BD y genere el JWT
    return this.authService.googleLogin(req.user);
  }

  @Get("private")
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req() req: Express.Request,
    @GetUser() user: User,
    @GetUser("email") userEmail: string,

    @RawHeaders("rawHeaders") rawHeaders: string[],
    @Headers() headers: http.IncomingHttpHeaders

  ) {

    return {
      ok: true,
      message: "Hola mundo privado",
      user,
      userEmail,
      rawHeaders,
      headers
    }
  }


  @Get("private2")
  @RoleProtected(ValidRoles.admin, ValidRoles.superUser)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(
    @GetUser() user: User,
  ) {

    return {
      ok: true,
      user

    }
  }


  @Get("private3")
  @Auth(ValidRoles.admin)
  privateRoute3(
    @GetUser() user: User,
  ) {

    return {
      ok: true,
      user

    }
  }

}
