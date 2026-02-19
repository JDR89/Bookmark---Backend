import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Controller('bookmarks')
@Auth()
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) { }

  @Post()
  create(
    @Body() createBookmarkDto: CreateBookmarkDto,
    @GetUser() user: User
  ) {
    return this.bookmarksService.create(createBookmarkDto, user);
  }

  // GET /bookmarks/collection/:id
  @Get('collection/:id')
  findAllByCollection(
    @Param('id', ParseUUIDPipe) collectionId: string,
    @GetUser() user: User
  ) {
    return this.bookmarksService.findAll(collectionId, user);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User
  ) {
    return this.bookmarksService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
    @GetUser() user: User
  ) {
    return this.bookmarksService.update(id, updateBookmarkDto, user);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User
  ) {
    return this.bookmarksService.remove(id, user);
  }
}