import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateServerDto } from './dto/create-server.dto';
import { Servers } from './servers.entity';
import gamedig from 'gamedig';

@Injectable()
export class ServersService {
  constructor(@InjectModel(Servers) private serversEntity: typeof Servers) {}

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

  private async getServerInfo(host: string, port: number){
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
        connect: data.connect
      }
    } catch(e){
      return {
        active: false,
        max_players: 0,
        players: [],
        ping: 0,
        connect: ''
      }
    }
  }

  async getInfo(){
    let servers = await this.serversEntity.findAll();
    let data = [];
    for(let i = 0; i< servers.length; i++){
      let { server_ip, server_port } = servers[i];
      let info = await this.getServerInfo(server_ip, server_port);
      data.push(info);
    }
    return data;
  }  
}
