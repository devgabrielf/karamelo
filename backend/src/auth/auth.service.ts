import { ForbiddenException, Injectable } from '@nestjs/common';
import { SignupDto, SigninDto } from './dtos';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { nanoid } from 'nanoid';
import { ErrorMessage } from './enums';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup({ password, ...rest }: SignupDto) {
    const id = nanoid(8);
    const hash = await argon.hash(password);

    try {
      const user = await this.prisma.user.create({
        data: {
          id,
          hash,
          ...rest,
        },
      });

      const { accessToken } = await this.signToken(user.id, user.email);

      return {
        id: user.id,
        accessToken,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(ErrorMessage.CREDENTIALS_TAKEN);
        }
      }
      throw error;
    }
  }

  async signin({ email, password }: SigninDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new ForbiddenException(ErrorMessage.CREDENTIALS_INCORRECT);
    }

    const pwMatches = await argon.verify(user.hash, password);

    if (!pwMatches) {
      throw new ForbiddenException(ErrorMessage.CREDENTIALS_INCORRECT);
    }

    const { accessToken } = await this.signToken(user.id, user.email);

    return {
      id: user.id,
      accessToken,
    };
  }

  async signToken(userId: string, email: string) {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '30d',
      secret,
    });

    return {
      accessToken: token,
    };
  }
}
