import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Workspace } from './entities/workspace.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class WorkspacesService {
  private readonly logger = new Logger('WorkspacesService');

  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
  ) { }

  async create(createWorkspaceDto: CreateWorkspaceDto, user: User) {
    try {
      const workspace = this.workspaceRepository.create({
        ...createWorkspaceDto,
        user,
      });
      await this.workspaceRepository.save(workspace);
      return workspace;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(user: User) {
    return await this.workspaceRepository.find({
      where: { user: { id: user.id } },
      order: { orderIndex: 'ASC' }
    });
  }

  async findOne(id: string, user: User) {
    const workspace = await this.workspaceRepository.findOne({
      where: { id, user: { id: user.id } } // <--- ¡Seguridad! Solo si es tuyo
    });

    if (!workspace) throw new NotFoundException(`Workspace with id ${id} not found`);

    return workspace;
  }

  async update(id: string, updateWorkspaceDto: UpdateWorkspaceDto, user: User) {
    const workspace = await this.findOne(id, user); // Reusamos findOne para seguridad

    try {
      if (updateWorkspaceDto.name) {
        updateWorkspaceDto.slug = updateWorkspaceDto.name
          .toLowerCase()
          .replaceAll(' ', '_')
          .replaceAll("'", '');
      }
      this.workspaceRepository.merge(workspace, updateWorkspaceDto);
      return await this.workspaceRepository.save(workspace);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string, user: User) {
    const workspace = await this.findOne(id, user); // Reusamos findOne para seguridad
    await this.workspaceRepository.remove(workspace);
    return { message: 'Workspace deleted successfully' };
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}