import { Body, Controller, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import e from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 } from 'uuid';
import { AdminService } from './admin.service';
import { CreateServerDto } from './dto/create-server.dto';

@Controller('admin')
export class AdminController {
    constructor(private adminService: AdminService){}

    @UseInterceptors(FilesInterceptor('files', undefined, {
        storage: diskStorage({
            'destination': 'uploads/servers',
            filename: (req, file, callback) => {
                return callback(null, `${v4()}.${extname(file.originalname)}`);
            }
        })
    }))
    @Post('/servers/create')
    async createServer(dto: CreateServerDto, @UploadedFiles() files: Express.Multer.File[]){
        return await this.adminService.createServer(dto, files);
    }

    @Post('/servers/delete')
    async deleteServer(@Body('id') serverId: string){
        return await this.adminService.deleteServer(Number(serverId));
    }

    @Post('/servers/state')
    async stateServer(@Body('id') id: string){
        return await this.adminService.stateServer(Number(id));
    }

    @Get('/servers/:id')
    async findServerById(@Param('id') id: string){
        return await this.adminService.findServerById(Number(id));
    }

    @Get('/servers')
    async findAllServers(){
        return await this.adminService.findAllServers();
    }

}
