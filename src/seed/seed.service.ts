import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { initialData } from './data/seed-data'; // <--- Importante: necesitas re-importar esto

@Injectable()
export class SeedService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async runSeed() {
    await this.deleteTables();
    await this.insertNewUsers();
    return "SEED EXECUTED";
  }

  private async deleteTables() {
    // Borramos todos los usuarios
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute();
  }

  private async insertNewUsers() {
    const seedUsers = initialData.users; // Aquí usamos la data inicial

    const users: User[] = seedUsers.map(user => this.userRepository.create({
      ...user,
      password: bcrypt.hashSync(user.password, 10)
    }));

    await this.userRepository.save(users);

    return "Users created";
  }
}