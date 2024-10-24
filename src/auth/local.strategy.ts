import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { compareSync } from 'bcryptjs';
import { Strategy } from 'passport-local';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private usersService: UsersService) {
        super({
            usernameField: 'email',
            passwordField: 'password',
        });
    }

    async validate(email: string, password: string): Promise<User> {
        const user = await this.usersService.findOne(email);

        if (!user) {
            throw new UnauthorizedException();
        }

        if (!user?.password || !compareSync(password, user?.password)) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
