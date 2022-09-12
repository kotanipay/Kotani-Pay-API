import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BlockchainService } from '@kotanicore/blockchain';
import { CreateUserDto } from '@kotanicore/repository/dtos/createUser.dto';
import { SetKycDto } from '@kotanicore/repository/dtos/setKyc.dto';
import { RepositoryService } from '@kotanicore/repository';

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
        uid: userId,
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
  async getAllUsers() {
    try {
      return await this.repo.getAllUserDetails();
    } catch (error) {
      throw new Error(error);
    }
  }

  async getRecentAddUserList() {
    try {
      return await this.repo.getRecentAddedUser();
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUsersAnalytics() {
    try {
      return await this.repo.getUserAnalytics();
    } catch (error) {
      throw new Error(error);
    }
  }

  async fetchWallet(id: string) {
    try {
      return await this.repo.getAccountAddress(id);
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
}
