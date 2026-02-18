import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';
// import { Product } from 'src/products/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';


@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>

  ) { }

  async runSeed() {

    await this.deleteTables()
    const adminUser = await this.insertNewUsers()
    await this.insertNewProducts(adminUser)

    return "seediado"
  }

  private async deleteTables() {
    await this.productsService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();

    await queryBuilder
      .delete()
      .where({})
      .execute()

  }

  private async insertNewUsers() {
    const seedUsers = initialData.users

    const users: User[] = seedUsers.map(user => this.userRepository.create({
      ...user,
      password: bcrypt.hashSync(user.password, 10)
    }))
    await this.userRepository.save(users)

    return users[0]
  }

  private async insertNewProducts(user: User) {
    await this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = products.map(p => this.productsService.create(p, user));

    await Promise.all(insertPromises);


    return true;
  }
}
