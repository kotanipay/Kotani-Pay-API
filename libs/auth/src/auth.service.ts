import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RepositoryService, UserInterface } from '@kotanicore/repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private repo: RepositoryService,
  ) {}

  async validateUser(phone: string, password: string) {
    const user = await this.repo.checkIfUserExists(phone);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async login(
    user: UserInterface,
    ipAddress: string,
  ): Promise<{ token: string }> {
    const payload = {
      user: {
        id: user.id,
        name: user.name,
        phone: user.phoneNumber,
      },
      sub: user.id,
    };

    try {
      const result = {
        token: this.jwtService.sign(payload),
      };
      return result;
    } catch (err) {
      console.error('authentication/login ||', err);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
