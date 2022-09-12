import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CoreService } from '@kotanicore/services';
import { CreateUserDto } from '@kotanicore/repository/dtos/createUser.dto';
import { SetKycDto } from '@kotanicore/repository/dtos/setKyc.dto';
import { GetBalanceDto } from '@kotanicore/repository/dtos/getBalance.dto';
import { AuthService, JwtAuthGuard } from '@kotanicore/auth';
import { LoginDto } from '@kotanicore/repository/dtos/login.dto';
import { GetUserDto } from '@kotanicore/repository/dtos/getUser.dto';
import {
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Roles } from '@kotanicore/auth/rbac/roles.decorator';
import { Role } from '@kotanicore/auth/rbac/enums/role.enum';
import { HttpService } from '@nestjs/axios';
import { ApiResponse, ITransaction } from '@kotanicore/repository/interface/transaction';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

@Controller()
export class AppController {
  tx = [];
  constructor(
    private readonly authService: AuthService,
    private readonly appService: AppService,
    private readonly coreService: CoreService,
  ) {}

  @Get()
  @ApiOkResponse({ description: 'The resources were returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('login')
  @ApiCreatedResponse({ description: 'Created Succesfully' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  async login(@Body() data: LoginDto) {
    const user = await this.authService.validateUser(data.phone, data.password);

    if (user) {
      return await this.authService.login(user, '');
    } else {
      throw new HttpException('Wrong Credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('create')
  @ApiCreatedResponse({ description: 'Created Succesfully' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @Roles(Role.Admin)
  async createUser(@Body() createUser: CreateUserDto) {
    return await this.coreService.createUser(createUser);
  }

  @UseGuards(JwtAuthGuard)
  @Post('kyc')
  @ApiCreatedResponse({ description: 'Created Succesfully' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  async addUserKyc(@Body() setKycData: SetKycDto) {
    return await this.coreService.setUserKyc(setKycData, 'userId');
  }

  @UseGuards(JwtAuthGuard)
  @Get('balance')
  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  async getBalance(@Body() body: GetBalanceDto): Promise<any> {
    return await this.coreService.getBalance(body.phoneNumber);
  }

  @Get('all-users')
  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  async getAllUsers() {
    const usercount = await this.coreService.listUsers();
    return {
      usercount: usercount,
    };
  }

  // send ObjectId
  @Post('user')
  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  async getUser(@Body() body: GetUserDto): Promise<any> {
    return await this.coreService.getUser(body.id);
  }

  @Post('transactions')
  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  async getTransactions(@Body() body: GetUserDto): Promise<any> {
    const address = await this.coreService.fetchWallet(body.id);
    // make post request to fetch transaction
     

    // const txObservable = transactions.subscribe((res) => {
    //   return res;
    //   console.log('----->', res);
    // });

    // console.log('----->', transactions);

    // const getTrans = transactions.subscribe((transaction) => {
    //   console.log(transaction);
    //   // this.tx = transaction.map()
    // });

    return {
      transactions: this.appService.findAll(
        '0xf9436398a70146f58f535c6b93d6845d1afb390b',
      ),
    };
  }
  @Get('all-user-details')
  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  async getAllUserDetails() {
    const users = await this.coreService.getAllUsers();
    // TODO mount wallet public address on the response
    return {
      users: users,
    };
  }
  @Get('recent-users')
  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  async getRecentUsers() {
    const users = await this.coreService.getRecentAddUserList();
    return {
      users: users,
    };
  }

  @Get('users-analytics')
  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  async getUserAnalyticsData() {
    const usersData = await this.coreService.getUsersAnalytics();
    return {
      usersData: usersData,
    };
  }
}
function findAll() {
  throw new Error('Function not implemented.');
}
