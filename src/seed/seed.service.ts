import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Workspace } from 'src/workspaces/entities/workspace.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
  ) { }

  async runSeed() {
    await this.deleteTables();
    await this.insertNewUsers();
    return "SEED EXECUTED";
  }

  private async deleteTables() {
    const workspaceQueryBuilder = this.workspaceRepository.createQueryBuilder();
    await workspaceQueryBuilder
      .delete()
      .where({})
      .execute();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute();
  }

  private async insertNewUsers() {
    const seedUsers = initialData.users;

    const users: User[] = seedUsers.map(user => this.userRepository.create({
      ...user,
      password: bcrypt.hashSync(user.password, 10)
    }));

    await this.userRepository.save(users);

    return "Users created";
  }
}
