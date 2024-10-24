import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignUpDTO {
    @ApiProperty() @IsNotEmpty() @IsEmail() email: string;
    @ApiProperty() @IsNotEmpty() password: string;
    @ApiProperty() @IsNotEmpty() name: string;
    @ApiProperty() @IsNotEmpty() pseudonym: string;
}

export class SignInDTO {
    @ApiProperty() @IsNotEmpty() @IsEmail() email: string;
    @ApiProperty() @IsNotEmpty() password: string;
}
