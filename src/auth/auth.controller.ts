import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { SignupDTO } from './auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    async login(@Request() req: Express.Request) {
        return this.authService.signIn(req.user!);
    }

    @Post('auth/signup')
    async signup(@Body() body: SignupDTO) {
        return this.authService.signUp(body);
    }
}
