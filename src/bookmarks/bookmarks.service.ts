import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { Repository } from 'typeorm';
import { Collection } from '../collections/entities/collection.entity'; // Asegúrate ruta
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class BookmarksService {
  private readonly logger = new Logger('BookmarksService');

  constructor(
    @InjectRepository(Bookmark)
    private readonly bookmarkRepository: Repository<Bookmark>,

    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
  ) { }

  async create(createBookmarkDto: CreateBookmarkDto, user: User) {
    const { collectionId, ...bookmarkDetails } = createBookmarkDto;

    // 1. Validar que la colección exista Y pertenezca al usuario (validación profunda)
    const collection = await this.collectionRepository.findOne({
      where: {
        id: collectionId,
        workspace: { user: { id: user.id } } // User -> Workspace -> Collection
      }
    });

    if (!collection) throw new NotFoundException(`Collection with id ${collectionId} not found (or not yours)`);

    try {
      const bookmark = this.bookmarkRepository.create({
        ...bookmarkDetails,
        collection,
      });
      await this.bookmarkRepository.save(bookmark);
      return bookmark;

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(collectionId: string, user: User) {
    // Validamos primero la colección (opcional, pero buena práctica de seguridad)
    const collection = await this.collectionRepository.findOne({
      where: {
        id: collectionId,
        workspace: { user: { id: user.id } }
      }
    });
    if (!collection) throw new NotFoundException(`Collection not found`);

    return await this.bookmarkRepository.find({
      where: { collection: { id: collectionId } },
      order: { orderIndex: 'ASC' }
    });
  }

  async findOne(id: string, user: User) {
    const bookmark = await this.bookmarkRepository.findOne({
      where: {
        id,
        collection: { workspace: { user: { id: user.id } } } // User -> Workspace -> Collection -> Bookmark
      }
    });

    if (!bookmark) throw new NotFoundException(`Bookmark with id ${id} not found`);
    return bookmark;
  }

  async update(id: string, updateBookmarkDto: UpdateBookmarkDto, user: User) {
    const bookmark = await this.findOne(id, user); // Seguridad primero
    try {
      this.bookmarkRepository.merge(bookmark, updateBookmarkDto);
      return await this.bookmarkRepository.save(bookmark);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string, user: User) {
    const bookmark = await this.findOne(id, user); // Seguridad primero
    await this.bookmarkRepository.remove(bookmark);
    return { message: 'Bookmark deleted successfully' };
  }

  private handleDBExceptions(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}