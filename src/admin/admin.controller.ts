import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import e from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateCaseDto } from './dto/create-case.dto';
import { v4 } from 'uuid';
import { AdminService } from './admin.service';
import { CreateItemsCaseDto } from './dto/create-items-case.dto';
import { CreateServerDto } from './dto/create-server.dto';
import { CreateDonateDto } from './dto/create-donate.dto';
import { CreateKitsDto } from './dto/create-kits.dto';
import { Admin } from 'src/auth/admin.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

@Admin()
@UseGuards(AuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('/servers/create')
  async createServer(@Body() dto: CreateServerDto) {
    return await this.adminService.createServer(dto);
  }

  @Post('/servers/delete')
  async deleteServer(@Body('id') serverId: number) {
    return await this.adminService.deleteServer(serverId);
  }

  @Post('/servers/state')
  async stateServer(@Body('id') id: number) {
    return await this.adminService.stateServer(id);
  }

  @Get('/servers/:id')
  async findServerById(@Param('id') id: string) {
    return await this.adminService.findServerById(Number(id));
  }

  @Get('/servers')
  async findAllServers() {
    return await this.adminService.findAllServers();
  }

  @Post('/shop/case/create')
  async createCaseProduct(
    @Body('case') caseDto: CreateCaseDto,
    @Body('items') itemsDto: CreateItemsCaseDto[],
  ) {
    return await this.adminService.createCaseProduct(caseDto, itemsDto);
  }

  @Post('/shop/donate/create')
  async createDonateProduct(
    @Body('donate') donateDto: CreateDonateDto,
    @Body('kits') kitsDto: CreateKitsDto[],
  ) {
    return await this.adminService.createDonateProduct(donateDto, kitsDto);
  }

  @Get('/shop')
  async getAllProducts() {
    return await this.adminService.getAllProducts();
  }
}
