import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse
} from '@nestjs/swagger';
import { FindServerByIdDto } from './dto/find-server-by-id.dto';
import { ServerInfoDto } from './dto/server-info.dto';
import { ServerSerializer } from './server.serializer';
import { ServersService } from './servers.service';

@ApiTags('candy-craft')
@Controller('servers')
export class ServersController {
  constructor(private serversService: ServersService) { }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Найти сервер по ID', summary: 'Найти сервер по ID' })
  @ApiOkResponse({ type: FindServerByIdDto })
  @Get('/:id')
  async findById(@Param('id') id: number): Promise<FindServerByIdDto> {
    let data = await this.serversService.findById(id);
    return { ...new ServerSerializer(data) };
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Получить все сервера', summary: 'Получить все сервера' })
  @ApiOkResponse({ type: [FindServerByIdDto] })
  @Get('/')
  async findAll(): Promise<FindServerByIdDto[]> {
    let data = await this.serversService.findAll();
    return data.map((x) => ({ ...new ServerSerializer(x) }));
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Информация об онлайне серверов', summary: 'Информация об онлайне серверов' })
  @ApiOkResponse({ type: [ServerInfoDto] })
  @Get('/info')
  async getInfo(): Promise<ServerInfoDto[]> {
    return await this.serversService.getInfo();
  }
}
