import { Injectable } from '@nestjs/common';
import * as contractkit from '@celo/contractkit';
import * as bip39 from 'bip39-light';
import * as crypto from 'crypto';
import {
  createcypher,
  getPublicAddress,
} from '@kotanicore/blockchain/utilities';
import { AccountInterface } from '@kotanicore/repository/interface/account.interface';
const phone_hash_fn = 'sha1';
const iv = process.env.IV;
const NODE_URL = 'https://celo-mainnet--rpc.datahub.figment.io/apikey/API_KEY/';
const kit = contractkit.newKit(NODE_URL);

@Injectable()
export class BlockchainService {
  getUserId = (senderMSISDN): Promise<string> => {
    return new Promise((resolve) => {
      const senderId = crypto
        .createHash(phone_hash_fn)
        .update(senderMSISDN)
        .digest('hex');
      resolve(senderId);
    });
  };

  retreiveCusdBalance = async (publicAddress: string) => {
    const cusdToken = await kit.contracts.getStableToken();
    return await cusdToken.balanceOf(publicAddress); // In cUSD
  };

  createMnemonic = async () => await bip39.generateMnemonic(256);

  async createAccountInfo(
    phone: string,
    mnemonic: string,
  ): Promise<Partial<AccountInterface>> {
    const enc_seed = await createcypher(mnemonic, phone, iv);
    const publicAddress = await getPublicAddress(mnemonic);
    return {
      seedKey: enc_seed,
      publicAddress: publicAddress,
    };
  }

  async getPrivateKey(seedkey: string, IV: string) {
    return '';
  }
}
