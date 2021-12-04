import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateServerDto } from './dto/create-server.dto';
import { Servers } from './servers.entity';
import gamedig from 'gamedig';
import { ServerInfoDto } from './dto/server-info.dto';
import { IServers } from './servers.interface';

@Injectable()
export class ServersService {
  private serversInfo: ServerInfoDto[] = [];

  constructor(@InjectModel(Servers) private serversEntity: typeof Servers) {
    this.poolServers();
  }

  async findAll(): Promise<Servers[]> {
    return await this.serversEntity.findAll();
  }

  async findById(id: number): Promise<Servers> {
    let server = await this.serversEntity.findByPk(id);
    if (!server) {
      throw new BadRequestException({
        message: 'Сервер с такими ID - не найден',
      });
    }
    return server;
  }

  async create(dto: CreateServerDto): Promise<Servers> {
    return await this.serversEntity.create(dto);
  }

  async update(dto: IServers): Promise<Servers> {
    let server = await this.serversEntity.findByPk(dto.id);
    if (!server) {
      throw new BadRequestException({
        message: 'Сервер с таким ID - не найден',
      });
    }
    return await server.update(dto);
  }

  async state(id: number): Promise<Servers> {
    let server = await this.findById(id);
    server.active = !server.active;
    await server.save();
    return server;
  }

  async delete(id: number): Promise<Servers> {
    let server = await this.findById(id);
    await server.destroy();
    return server;
  }

  private async getServerInfo(
    host: string,
    port: number,
  ): Promise<ServerInfoDto> {
    try {
      let data = await gamedig.query({
        type: 'minecraft',
        host,
        port,
      });

      return {
        active: true,
        max_players: data.maxplayers,
        players: data.players,
        ping: data.ping,
        connect: data.connect,
      };
    } catch (e) {
      return {
        active: false,
        max_players: 0,
        players: [],
        ping: 0,
        connect: '',
      };
    }
  }

  async getInfo(): Promise<ServerInfoDto[]> {
    return this.serversInfo;
  }

  private async poolServers() {
    try {
      let servers = await this.serversEntity.findAll();
      for (let i = 0; i < servers.length; i++) {
        let { server_ip, server_port } = servers[i];
        let info = await this.getServerInfo(server_ip, server_port);
        this.serversInfo.push(info);
      }
      return this.serversInfo;
    } finally {
      setTimeout(this.poolServers, 1000 * 60 * 30);
    }
  }
}
