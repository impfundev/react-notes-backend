import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { User } from '@prisma/client';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: User, @Res() res: Response) {
    const data = await this.authService.signIn(
      signInDto.email,
      signInDto.username,
      signInDto.password,
    );
    return res
      .cookie('access_token', data.access_token, {
        httpOnly: true,
        maxAge: 7 * 24 * 3600000, // 1 weeks
      })
      .status(200)
      .json(data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async signUp(@Body() signUpDto: User, @Res() res: Response) {
    const data = await this.authService.signUp(
      signUpDto.email,
      signUpDto.username,
      signUpDto.password,
    );

    return res
      .cookie('access_token', data.access_token, {
        httpOnly: true,
        maxAge: 7 * 24 * 3600000, // 1 weeks
      })
      .status(200)
      .json(data);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
  }
}
