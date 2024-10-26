import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Request,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiOperation,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import {
    BookQueryDTO,
    CreateBookDto,
    CreateBookDtoWithCoverImage,
    UpdateBookDto,
    UpdateBookWithCoverImageDto,
} from './book.dto';
import { BookService } from './book.service';

@ApiTags('Books')
@Controller('book')
export class BookController {
    constructor(private readonly bookService: BookService) {}

    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data', 'application/json')
    @ApiOperation({ summary: 'Publish new book' })
    @ApiBody({
        type: CreateBookDtoWithCoverImage,
    })
    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('coverImage'))
    create(
        @Body() createBookDto: CreateBookDto,
        @Request() req: Express.Request,
        @UploadedFile() coverImage?: Express.Multer.File,
    ) {
        return this.bookService.create(createBookDto, req.user!, coverImage);
    }

    @ApiOperation({ summary: 'Search books in market' })
    @ApiQuery({ type: BookQueryDTO })
    @Get()
    async findAll(@Query('search') search: string | undefined) {
        return await this.bookService.search(search);
    }

    @ApiOperation({ summary: 'Get book by id' })
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.bookService.findOne(id);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update info of existing book' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        type: UpdateBookWithCoverImageDto,
    })
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    @UseInterceptors(FileInterceptor('coverImage'))
    update(
        @Param('id') id: string,
        @Body() updateBookDto: UpdateBookDto,
        @Request() req: Express.Request,
        @UploadedFile() coverImage?: Express.Multer.File,
    ) {
        return this.bookService.update(id, updateBookDto, coverImage, req.user!);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Unpublish book' })
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string, @Request() req: Express.Request) {
        return this.bookService.remove(id, req.user!);
    }
}
