import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { EMERGENT_BASE_URL } from '@kotanicore/integrations/constants';

@Injectable()
export class EmergentService {
  async cashOut(...params) {
    return await axios.post(`${EMERGENT_BASE_URL}/CreateCashoutTrans`, params);
  }

  async transactionStatus(...params) {
    return await axios.post(`${EMERGENT_BASE_URL}/CashoutTransStatus`, params);
  }
}
