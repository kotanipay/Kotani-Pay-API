import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { BlockchainService } from '@kotanicore/blockchain';
import { CreateUserDto } from '@kotanicore/repository/dtos/createUser.dto';
import { SetKycDto } from '@kotanicore/repository/dtos/setKyc.dto';
import { RepositoryService } from '@kotanicore/repository';
import { LendingProviderAddress } from '@kotanicore/services/constants';

@Injectable()
export class CoreService {
  constructor(
    private readonly blockService: BlockchainService,
    private readonly repo: RepositoryService,
  ) {}

  async createUser(userData: CreateUserDto) {
    try {
      const user = await this.repo.checkIfUserExists(userData.phoneNumber);

      if (user) {
        throw new HttpException('User already exist', HttpStatus.CONFLICT);
      }

      const userId = await this.blockService.getUserId(userData.phoneNumber);

      const result = this.repo.createUser({
        id: userId,
        ...userData,
      });

      const mme = await this.blockService.createMnemonic();
      const account = await this.blockService.createAccountInfo(
        userData.phoneNumber,
        mme,
      );

      await this.repo.createAccount({
        id: userId,
        seedKey: account.seedKey,
        publicAddress: account.publicAddress,
      });

      return result;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async setUserKyc(kycData: SetKycDto, userId: string) {
    const isUserKyc = this.repo.checkisUserKyced(userId);
    if (isUserKyc) {
      throw new HttpException('User is Already Kycd', HttpStatus.CONFLICT);
    }
    return await this.repo.setUserKyc({
      _id: userId,
      ...kycData,
    });
  }

  async getBalance(id: string) {
    try {
      const account = await this.repo.getAccountInfo(id);
      const cUsdBalance = await this.blockService.retreiveCusdBalance(
        account.publicAddress,
      );
      return {
        success: true,
        balance: cUsdBalance,
      };
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async listUsers() {
    try {
      return await this.repo.getAllUsers();
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUser(id: string) {
    try {
      return await this.repo.getUserDetails(id);
    } catch (error) {
      throw new Error(error);
    }
  }

  async listTransactions() {
    try {
      return await this.repo.getAllTransactions();
    } catch (error) {
      throw new Error(error);
    }
  }

  async processMoolaLoan(id: string, amount: number) {
    //cUSD
    const cusdAdresss = '0x765DE816845861e75A25fCA122bb6898B8B1282a';
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const moolaTokenAbi = require('./constants/ABI/moolatoken.json');
    const cusdContract = new ethers.Contract(moolaTokenAbi, cusdAdresss);
    const cusdContractAddress = cusdContract.option.address;

    //Address Provider Contract
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const addressProviderAbi = require('./constants/ABI/lendingpooladress.json');
    const addressProviderContract = new ethers.Contract(
      addressProviderAbi,
      LendingProviderAddress,
    );

    //Lending Contract
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const lendingPoolAbi = require('./constants/ABI/lendingpool.json');
    const lendingPoolAddress = await addressProviderContract.methods
      .getLendingPool()
      .call();

    const userInfo = await this.repo.getAccountDetails(id);
    const privateKey = await this.blockService.getPrivateKey(
      userInfo.seedKey,
      process.env.IV,
    );

    //load kit
    const borrowerWallet = new ethers.Wallet(privateKey);
    const lendingPool = new ethers.Contract(
      lendingPoolAbi,
      lendingPoolAddress,
      borrowerWallet,
    );

    //
    await lendingPool.methods.borrow(
      cusdContractAddress,
      amount,
      'STABLE',
      0,
      userInfo.publicaddress,
    );

    return {
      success: 200,
      message: 'Loan processed succesfully',
    };
  }
}
