import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { BIT2BIG_BASE_URL } from '@kotanicore/integrations/constants';

@Injectable()
export class BitService {
  //constructor() {}

  async cashOut() {
    return await axios.post(`${BIT2BIG_BASE_URL}`, {});
  }

  async transactionStatus() {
    return await axios.get(`${BIT2BIG_BASE_URL}`, {});
  }
}
