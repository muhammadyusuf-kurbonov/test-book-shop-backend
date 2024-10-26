import { Body, Controller, Post, Request, Response, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { SignInDTO, SignUpDTO } from './auth.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @ApiOperation({ summary: 'Login using email and password' })
    @Post('login')
    async login(@Request() req: Express.Request, @Body() body: SignInDTO) {
        return await this.authService.signIn(req.user!);
    }

    @ApiOperation({ summary: 'Sign up to marketplace' })
    @Post('signup')
    async signup(@Body() body: SignUpDTO) {
        return await this.authService.signUp(body);
    }
}
