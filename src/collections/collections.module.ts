import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';
import { Workspace } from 'src/workspaces/entities/workspace.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Collection, Workspace])
  ],
  controllers: [CollectionsController],
  providers: [CollectionsService],
})
export class CollectionsModule { }
