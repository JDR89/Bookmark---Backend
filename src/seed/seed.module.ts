import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from 'src/workspaces/entities/workspace.entity';
import { Collection } from 'src/collections/entities/collection.entity';
import { Bookmark } from 'src/bookmarks/entities/bookmark.entity';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Workspace, Collection, Bookmark])
  ],
})
export class SeedModule { }
