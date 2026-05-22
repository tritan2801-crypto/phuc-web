import { Controller, Post, Get, Body, Res, Headers, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(loginDto);
    
    // Set cookie
    response.cookie('session_token', result.sessionToken, {
      httpOnly: true,
      secure: false, // Set to true in production if using HTTPS
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: '/',
    });

    return {
      message: 'Đăng nhập thành công',
      user: result.user,
    };
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('session_token', { path: '/' });
    return { message: 'Đăng xuất thành công' };
  }

  @Get('me')
  me(@Headers('cookie') cookieHeader?: string) {
    return this.authService.me(cookieHeader);
  }
}
