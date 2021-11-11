import { Injectable } from '@nestjs/common';
import { ServersService } from 'src/servers/servers.service';
import { CreateServerDto } from './dto/create-server.dto';

@Injectable()
export class AdminService {
    constructor(
        private serversService: ServersService
    ) { }

    async createServer(dto: CreateServerDto, files: Express.Multer.File[]) {
        return this.serversService.create({
            ...dto,
            'media': files.slice(1, files.length - 1).map(x => x.destination).join(','),
            'server_gif_path': files[0].destination
        });

    }
    async deleteServer(serverId: number) { 
        return await this.serversService.delete(serverId);
    }
    async stateServer(serverId: number) { 
        return await this.serversService.state(serverId);
    }
    async findServerById(serverId: number) { 
        return await this.serversService.findById(serverId);
    }
    async findAllServers() {
        return await this.serversService.findAll();
    }
}
