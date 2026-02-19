import { Module } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { BookmarksController } from './bookmarks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { Collection } from '../collections/entities/collection.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bookmark, Collection]),
    AuthModule
  ],
  controllers: [BookmarksController],
  providers: [BookmarksService],
})
export class BookmarksModule { }
