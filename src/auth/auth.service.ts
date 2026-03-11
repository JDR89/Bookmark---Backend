import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { createUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { WorkspacesService } from 'src/workspaces/workspaces.service';
import { CollectionsService } from 'src/collections/collections.service';
import { BookmarksService } from 'src/bookmarks/bookmarks.service';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly workspacesService: WorkspacesService,
    private readonly collectionsService: CollectionsService,
    private readonly bookmarksService: BookmarksService,
  ) { }

  async create(createUserDto: createUserDto) {

    try {

      const { password, ...rest } = createUserDto;

      const user = this.userRepository.create({
        ...rest,
        password: bcrypt.hashSync(password, 10),

      });

      await this.userRepository.save(user);

      await this.runOnboardingForNewUser(user);

      const { password: _, ...userWithoutPassword } = user;

      return {
        ...userWithoutPassword,
        token: this.getJwtToken({ id: user.id })
      }

    } catch (error) {

      this.handleDBErrors(error);

    }

  }

  async login(loginUserDto: LoginUserDto) {

    const { password, ...rest } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: {
        email: rest.email
      },
      select: { email: true, password: true, id: true }
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // if (!bcrypt.compareSync(password, user.password)) {
    //   throw new UnauthorizedException('Password not found');
    // }

    if (!user.password || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Contraseña incorrecta o el usuario usa Google LogIn');
    }

    // const { password: _, ...userWithoutPassword } = user;

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    }

  }

  async checkAuthStatus(user: User) {

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    }
  }

  async googleLogin(googleUser: any) {
    if (!googleUser) {
      throw new UnauthorizedException('No user from google');
    }
    // 1. Buscamos si el usuario ya existe por su email
    let user = await this.userRepository.findOne({
      where: { email: googleUser.email }
    });
    // 2. Si NO existe, lo creamos y lo guardamos
    if (!user) {
      user = this.userRepository.create({
        email: googleUser.email,
        fullName: googleUser.fullName,
        googleId: googleUser.googleId,
        isActive: true, // Asumimos que si entra con Google está activo
        // El password no se manda, y como hicimos nullable: true, está todo ok.
      });
      await this.userRepository.save(user);

      await this.runOnboardingForNewUser(user);
    }
    // 3. Si SÍ existe, pero es la primera vez que entra con Google, 
    // actualizamos su googleId (opcional pero muy útil)
    else if (!user.googleId) {
      user.googleId = googleUser.googleId;
      await this.userRepository.save(user);
    }
    // 4. ¡Generamos el Token y devolvemos la misma data que en login normal!
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      roles: user.roles,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload)

    return token
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new InternalServerErrorException(error.detail);
    }
    throw error;
  }

  private async runOnboardingForNewUser(user: User) {
    try {
      // 1. Crear el Workspace
      const defaultWorkspace = await this.workspacesService.create({
        name: 'Personal',
        // Asegúrate de pasar los campos exactos que pide tu CreateWorkspaceDto
      }, user);
      // 2. Crear las Colecciones vinculadas al Workspace
      const collection1 = await this.collectionsService.create({
        name: 'Read',
        workspaceId: defaultWorkspace!.id, // Verifica el nombre exacto de la property
        // Asegúrate de pasar los campos exactos que pide tu CreateCollectionDto
      }, user);
      const collection2 = await this.collectionsService.create({
        name: 'Inspiration',
        workspaceId: defaultWorkspace!.id,
      }, user);
      // 3. Crear los Bookmarks vinculados a cada Colección
      await this.bookmarksService.create({
        title: '¡Aprende NestJS!',
        url: 'https://docs.nestjs.com/',
        collectionId: collection1!.id,
      }, user);
      await this.bookmarksService.create({
        title: 'Documentación MDN',
        url: 'https://developer.mozilla.org/',
        collectionId: collection2!.id,
      }, user);
    } catch (error) {
      // Registrar el error pero no detener el registro del usuario si el onboarding falla por algo
      console.error('Error durante la creación del contenido de Onboarding:', error);
    }
  }

}
