import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ITransaction } from '@kotanicore/repository/interface/transaction';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  findAll(address: string) {
    return this.httpService
      .get(
        `https://explorer.celo.org/api?module=account&action=txlist&address=${address}`,
      )
      .pipe(
        map((response) => response.data.result),
        map((data) => ({
          status: 'success',
          payload: data,
        })),
      );
  }

  getHello(): string {
    return 'Hi from  Kotani Open Source!';
  }
}
