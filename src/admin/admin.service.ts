import { BadRequestException, Injectable } from '@nestjs/common';
import { PexService } from 'src/pex/pex.service';
import { ServersService } from 'src/servers/servers.service';
import { CreateCaseDto } from 'src/admin/dto/create-case.dto';
import { ShopService } from 'src/shop/shop.service';
import { CreateServerDto } from './dto/create-server.dto';
import { CreateItemsCaseDto } from './dto/create-items-case.dto';
import { CreateDonateDto } from './dto/create-donate.dto';
import { CreateKitsDto } from './dto/create-kits.dto';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class AdminService {
  constructor(
    private serversService: ServersService,
    private pexService: PexService,
    private shopService: ShopService
  ) { }

  async createServer(
    dto: CreateServerDto,
    files: { server_gif: Express.Multer.File; media: Express.Multer.File[] },
  ) {
    return await this.serversService.create({
      ...dto,
      mods: dto.mods.join(','),
      media: files.media.map((x) => x.filename).join(','),
      server_gif_path: files.server_gif[0].filename,
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

  async createDonateProduct(
    donateDto: CreateDonateDto,
    kitsDto: CreateKitsDto[],
  ) {
    
    // Проверяем есть ли сервер и такая донат группа
    donateDto.servers_id.split(',').map(async (x) => {
      let srvId = Number(x);
      let srv = await this.serversService.findById(srvId);
      if (!srv) {
        throw new BadRequestException({
          message: `Сервер с ID: ${srvId} - не найден`,
        });
      }
      let isGroupExists = this.pexService.isGroupExists(
        srv.pex_prefix,
        donateDto.pex_name,
      );
      if (!isGroupExists) {
        throw new BadRequestException({
          message: `У сервера ${srv.server_name} нет PEX - группы '${donateDto.pex_name}'`,
        });
      }
    });

    let data = await this.shopService.createDonateProduct(donateDto, donateDto.price);
    let kits = await this.shopService.createKitsForDonate(kitsDto.map(x => ({...x, donate_id: data.donate.id })));

    return {
      message: `Товар "Донат" - добавлен в магазин`,
      ...data,
      kits
    }
  }
  async createCaseProduct(
    caseDto: CreateCaseDto,
    itemsDto: CreateItemsCaseDto[],
  ) {

    let data = await this.shopService.createCaseProduct(caseDto, caseDto.price);
    let items = await this.shopService.createItemsForCase(itemsDto.map(x => ({ ...x, case_id: data.case.id })));

    return { 
      message: `Товар "Кейс" - добавлен в магазин`,
      ...data,
      items
    }
  }
  async deleteProductById(id: number) {
    return await this.shopService.deleteProductById(id);
  }
  async getAllProducts() {
    return await this.shopService.getFullProducts();
  }
}
