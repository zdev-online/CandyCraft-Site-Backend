import { Controller, Get, Param } from '@nestjs/common';
import { ServerSerializer } from './server.serializer';
import { ServersService } from './servers.service';

@Controller('servers')
export class ServersController {
  constructor(private serversService: ServersService) {}

  @Get('/:id')
  async findById(@Param('id') id: string) {
    let data = await this.serversService.findById(Number(id));
    return { ...new ServerSerializer(data) };
  }

  @Get('/')
  async findAll() {
    let data = await this.serversService.findAll();
    return data.map((x) => ({ ...new ServerSerializer(x) }));
  }
}
