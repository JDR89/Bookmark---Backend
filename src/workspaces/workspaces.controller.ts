import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Controller('workspaces')
@Auth()
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) { }

  @Post()
  create(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
    @GetUser() user: User
  ) {
    return this.workspacesService.create(createWorkspaceDto, user);
  }

  @Get()
  findAll(
    @GetUser() user: User
  ) {
    return this.workspacesService.findAll(user);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @GetUser() user: User
  ) {
    return this.workspacesService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
    @GetUser() user: User
  ) {
    return this.workspacesService.update(id, updateWorkspaceDto, user);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @GetUser() user: User
  ) {
    return this.workspacesService.remove(id, user);
  }
}