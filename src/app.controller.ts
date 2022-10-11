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
import { GetMoolaLoan } from '@kotanicore/repository/dtos/getMoolaLoan';

@Controller()
export class AppController {
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
    // console.log({ user });

    if (user) {
      return await this.authService.login(user, '');
    } else {
      throw new HttpException('Wrong Credentials', HttpStatus.UNAUTHORIZED);
    }
    // return;
  }

  @Post('create')
  @ApiCreatedResponse({ description: 'Created Succesfully' })
  @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
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
  @Get('user')
  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  async getUser(@Body() body: GetUserDto): Promise<any> {
    return await this.coreService.getUser(body.id);
  }

  @Get('transactions')
  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  async getTransactions() {
    const transactions = await this.coreService.listTransactions();
    return {
      transactions: transactions,
    };
  }

  @Get('cinchLoan')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  async getLoan(@Body() body: GetMoolaLoan) {
    return await this.coreService.processMoolaLoan(body.id, body.amount);
  }
}
