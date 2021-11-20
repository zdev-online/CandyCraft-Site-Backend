import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import e from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateCaseDto } from './dto/create-case.dto';
import { v4 } from 'uuid';
import { AdminService } from './admin.service';
import { CreateItemsCaseDto } from './dto/create-items-case.dto';
import { CreateServerDto } from './dto/create-server.dto';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @UseInterceptors(
    FilesInterceptor('files', undefined, {
      storage: diskStorage({
        destination: 'uploads/servers',
        filename: (req, file, callback) => {
          return callback(null, `${v4()}.${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @Post('/servers/create')
  async createServer(
    dto: CreateServerDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return await this.adminService.createServer(dto, files);
  }

  @Post('/servers/delete')
  async deleteServer(@Body('id') serverId: string) {
    return await this.adminService.deleteServer(Number(serverId));
  }

  @Post('/servers/state')
  async stateServer(@Body('id') id: string) {
    return await this.adminService.stateServer(Number(id));
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
  @UseInterceptors(
    FileFieldsInterceptor([
        { name: 'case_image', maxCount: 1 },
        { name: 'items_images' }
    ], {
        storage: diskStorage({
            destination: `uploads/shop`,
            filename: (req: e.Request, file, callback) => {
              return callback(null, `${v4()}${extname(file.originalname)}`);
            },
          })
    })
  )
  async createCaseProduct(
    @Body('case') caseDto: CreateCaseDto,
    @Body('items') itemsDto: CreateItemsCaseDto[],
    @UploadedFiles() files: { case_image: Express.Multer.File, items_images: Express.Multer.File[] }
  ) {
      return await this.adminService.createCaseProduct(caseDto, itemsDto, files.case_image, files.items_images);
  }
}
