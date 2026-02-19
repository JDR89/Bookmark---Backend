import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Collection } from './entities/collection.entity';
import { User } from 'src/auth/entities/user.entity';
import { Workspace } from 'src/workspaces/entities/workspace.entity';

@Injectable()
export class CollectionsService {
  private readonly logger = new Logger('CollectionsService');

  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,

    // Necesitamos inyectar el repositorio de Workspace para validar propiedad
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
  ) { }

  async create(createCollectionDto: CreateCollectionDto, user: User) {
    const { workspaceId, ...collectionDetails } = createCollectionDto;

    // 1. Validar que el workspace exista y pertenezca al usuario
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId, user: { id: user.id } }
    });

    if (!workspace) throw new NotFoundException(`Workspace with id ${workspaceId} not found`);

    try {
      // 2. Crear la colección
      const collection = this.collectionRepository.create({
        ...collectionDetails,
        workspace, // Relación directa
      });

      await this.collectionRepository.save(collection);
      return collection;

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(workspaceId: string, user: User) {
    // Validamos primero el workspace (opcional, pero buena práctica)
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId, user: { id: user.id } }
    });
    if (!workspace) throw new NotFoundException(`Workspace not found`);

    return await this.collectionRepository.find({
      where: { workspace: { id: workspaceId } },
      order: { name: 'ASC' }
    });
  }

  async findOne(id: string, user: User) {
    // Buscar colección asegurando que su workspace padre sea del usuario
    const collection = await this.collectionRepository.findOne({
      where: { id, workspace: { user: { id: user.id } } } // Query profunda
    });

    if (!collection) throw new NotFoundException(`Collection with id ${id} not found`);
    return collection;
  }

  async update(id: string, updateCollectionDto: UpdateCollectionDto, user: User) {
    const collection = await this.findOne(id, user); // Seguridad primero
    try {
      this.collectionRepository.merge(collection, updateCollectionDto);
      return await this.collectionRepository.save(collection);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string, user: User) {
    const collection = await this.findOne(id, user);
    await this.collectionRepository.remove(collection);
    return { message: 'Collection deleted successfully' };
  }

  private handleDBExceptions(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}