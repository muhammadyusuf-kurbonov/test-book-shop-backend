import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { AppModule } from 'src/app.module';
import { PrismaModule } from 'src/prisma/prisma.module';

describe('BookService', () => {
  let service: BookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookService],
      imports: [PrismaModule],
    }).compile();

    service = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
