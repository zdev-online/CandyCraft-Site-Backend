import { BadRequestException, Injectable } from '@nestjs/common';
import { PexService } from 'src/pex/pex.service';
import { ServersService } from 'src/servers/servers.service';
import { CreateCaseDto } from 'src/admin/dto/create-case.dto';
import { ShopService } from 'src/shop/shop.service';
import { CreateServerDto } from './dto/create-server.dto';
import { CreateItemsCaseDto } from './dto/create-items-case.dto';
import { CreateDonateDto } from './dto/create-donate.dto';
import { CreateKitsDto } from './dto/create-kits.dto';

@Injectable()
export class AdminService {
  constructor(
    private serversService: ServersService,
    private pexService: PexService,
    private shopService: ShopService,
  ) { }

  async createServer(dto: CreateServerDto, files: { server_gif: Express.Multer.File, media: Express.Multer.File[] }) {
    return await this.serversService.create({
      ...dto,
      media: files.media.map(x => x.filename).join(","),
      server_gif_path: files.server_gif.filename
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
    kits: CreateKitsDto[],
    donate_image: Express.Multer.File,
    kits_images: Express.Multer.File[]
  ) {
    if (kits_images.length != kits.length) {
      throw new BadRequestException({
        message:
          'Количество китов и количество их изображений - должны равны',
      });
    }
    donateDto.servers_id.split(',').map(async x => {
      let srvId = Number(x);
      let srv = await this.serversService.findById(srvId);
      if(!srv){
        throw new BadRequestException({ message: `Сервер с ID: ${srvId} - не найден` });
      }
      let isGroupExists = this.pexService.isGroupExists(srv.pex_prefix, donateDto.pex_name);
      if(!isGroupExists){
        throw new BadRequestException({ message: `У сервера ${srv.server_name} нет PEX - группы '${donateDto.pex_name}'` });
      }
    }); 

    let donate = await this.shopService.createDonateProduct({
      ...donateDto,
      image: donate_image.filename
    });
    let donate_kits = await this.shopService.createKitsForDonate(kits.map((x, i) => ({ ...x, image: kits_images[i].filename })))
    return { donate, kits: donate_kits }
  }
  async createCaseProduct(
    caseDto: CreateCaseDto,
    itemsDto: CreateItemsCaseDto[],
    case_image: Express.Multer.File,
    items_images: Express.Multer.File[],
  ) {
    if (itemsDto.length != items_images.length) {
      throw new BadRequestException({
        message:
          'Количество предметов кейса и количество их изображений - должны равны',
      });
    }
    let new_case = await this.shopService.createCaseProduct({
      ...caseDto,
      image: case_image.filename,
    });
    let items = itemsDto.map((x, i) => ({
      ...x,
      case_id: new_case.id,
      image: case_image[i],
    }));
    let case_items = await this.shopService.createItemsForCase(items);
    return { case: new_case, items: case_items };
  }
  async deleteProductById(id: number) {
    return await this.shopService.deleteProductById(id);
  }
  async getAllProducts(){
    return await this.shopService.getFullProducts();
  }
}
