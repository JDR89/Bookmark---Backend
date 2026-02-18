import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { createUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) { }

  async create(createUserDto: createUserDto) {

    try {

      const { password, ...rest } = createUserDto;

      const user = this.userRepository.create({
        ...rest,
        password: bcrypt.hashSync(password, 10)
      });

      await this.userRepository.save(user);

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

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Password not found');
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

}
