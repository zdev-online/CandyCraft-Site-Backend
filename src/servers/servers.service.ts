import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateServerDto } from './dto/create-server.dto';
import { Servers } from './servers.entity';

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
}
