import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    username: string,
    password: string,
  ): Promise<any> {
    let users: User[] | undefined;

    if (email) users = await this.userService.users({ where: { email } });
    if (username) users = await this.userService.users({ where: { username } });

    if (users.length === 0)
      return {
        message:
          'Username or Email invalid, please enter valid data or register first',
        statusCode: 401,
      };

    const user = users.find((user) => user.username === username);

    if (!user)
      return {
        message: 'User data not found',
        statusCode: 404,
      };

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid)
      return {
        message: 'Password Invalid, enter valid password',
        statusCode: 401,
      };

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      data: payload,
    };
  }

  async signUp(
    email: string,
    username: string,
    password: string,
  ): Promise<any> {
    if (!email || !username || !password)
      return {
        message:
          'Register failed: Username, Email, and Password cannot be empty',
        statusCode: 401,
      };

    const hashedPassword = bcrypt.hashSync(password, 8);
    const user = await this.userService.createUser({
      email,
      username,
      password: hashedPassword,
    });

    if (!user)
      return {
        message: 'Register failed: please try again later',
        statusCode: 500,
      };

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      data: payload,
    };
  }
}
