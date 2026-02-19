import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Controller('collections')
@Auth() // Protegemos todo
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) { }

  @Post()
  create(
    @Body() createCollectionDto: CreateCollectionDto,
    @GetUser() user: User
  ) {
    return this.collectionsService.create(createCollectionDto, user);
  }

  // GET /collections/workspace/:id
  @Get('workspace/:id')
  findAllByWorkspace(
    @Param('id', ParseUUIDPipe) workspaceId: string,
    @GetUser() user: User
  ) {
    return this.collectionsService.findAll(workspaceId, user);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User
  ) {
    return this.collectionsService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCollectionDto: UpdateCollectionDto, // Asegúrate de que este DTO existe y es un PartialType
    @GetUser() user: User
  ) {
    return this.collectionsService.update(id, updateCollectionDto, user);
  }
  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User
  ) {
    return this.collectionsService.remove(id, user);
  }
}