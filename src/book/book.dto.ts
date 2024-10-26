import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, IsString, IsUrl, isURL } from 'class-validator';
import { isNull } from 'util';

export class BookQueryDTO {
    @ApiProperty({ required: false }) @IsOptional() search?: string;
}

export class CreateBookDto {
    @ApiProperty() @IsString() title: string;
    @ApiProperty() @IsString() description: string;
    @ApiProperty() @IsPositive() @IsNumber({ maxDecimalPlaces: 2, allowInfinity: false, allowNaN: false }) price: number;
    @ApiProperty() @IsUrl() coverImage: string;
}

export class CreateBookDtoWithCoverImage extends CreateBookDto {
    @ApiProperty({ type: 'string', format: 'binary' }) coverImage: any;
}

export class UpdateBookDto extends PartialType(CreateBookDto) {}
export class UpdateBookWithCoverImageDto extends PartialType(CreateBookDtoWithCoverImage) {}
