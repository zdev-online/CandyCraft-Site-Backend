import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiHeader
} from '@nestjs/swagger';
import { CreateCaseDto } from './dto/create-case.dto';
import { AdminService } from './admin.service';
import { CreateItemsCaseDto } from './dto/create-items-case.dto';
import { CreateServerDto } from './dto/create-server.dto';
import { CreateDonateDto } from './dto/create-donate.dto';
import { CreateKitsDto } from './dto/create-kits.dto';
import { Admin } from 'src/auth/admin.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { Servers } from 'src/servers/servers.entity';
import { CreateCaseResponseDto } from './dto/create-case-response.dto';
import { CreateDonateResponseDto } from './dto/create-donate-response.dto';
import { GetFullProductDto } from 'src/shop/dto/get-full-products.dto';

@ApiBearerAuth('JWT_AUTH')
@ApiTags('candy-craft')
@Admin()
@UseGuards(AuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) { }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Создать сервер', summary: 'Создать сервер' })
  @ApiOkResponse({ type: Servers })
  @Post('/servers/create')
  async createServer(@Body() dto: CreateServerDto) {
    return await this.adminService.createServer(dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Удалить сервер', summary: 'Удалить сервер' })
  @ApiOkResponse({ type: Servers })
  @Post('/servers/delete')
  async deleteServer(@Body('id') serverId: number) {
    return await this.adminService.deleteServer(serverId);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Изменить состояние сервера', summary: 'Изменить состояние сервера' })
  @ApiOkResponse({ type: Servers })
  @Post('/servers/state')
  async stateServer(@Body('id') id: number) {
    return await this.adminService.stateServer(id);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Найти сервер по ID', summary: 'Найти сервер по ID' })
  @ApiOkResponse({ type: Servers })
  @Get('/servers/:id')
  async findServerById(@Param('id') id: string) {
    return await this.adminService.findServerById(Number(id));
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Получить все сервера', summary: 'Получить все сервера' })
  @ApiOkResponse({ type: [Servers] })
  @Get('/servers')
  async findAllServers() {
    return await this.adminService.findAllServers();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Создать кейс', summary: 'Создать кейс' })
  @ApiOkResponse({ type: CreateCaseResponseDto })
  @Post('/shop/case/create')
  async createCaseProduct(
    @Body('case') caseDto: CreateCaseDto,
    @Body('items') itemsDto: CreateItemsCaseDto[],
  ): Promise<CreateCaseResponseDto> {
    return await this.adminService.createCaseProduct(caseDto, itemsDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Создать донат', summary: 'Создать донат' })
  @ApiOkResponse({ type: CreateDonateResponseDto })
  @Post('/shop/donate/create')
  async createDonateProduct(
    @Body('donate') donateDto: CreateDonateDto,
    @Body('kits') kitsDto: CreateKitsDto[],
  ): Promise<CreateDonateResponseDto> {
    return await this.adminService.createDonateProduct(donateDto, kitsDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Получить все товары магазина', summary: 'Получить все товары магазина' })
  @ApiOkResponse({ type: GetFullProductDto })
  @Get('/shop')
  async getAllProducts(): Promise<GetFullProductDto> {
    return await this.adminService.getAllProducts();
  }
}
