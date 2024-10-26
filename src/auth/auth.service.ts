import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User as UserEntity } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { SignUpDTO } from './auth.dto';

declare global {
    namespace Express {
      interface Request {
        user?: UserEntity,
      }
    }
  }

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async signIn(user: UserEntity) {
        const payload = { sub: user.id, email: user.email };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async signUp(payload: SignUpDTO) {
        const user = await this.usersService.create(payload);
        // @ts-expect-error
        delete user.password;
        return user;
    }
}
