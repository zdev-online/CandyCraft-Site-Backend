import { BadRequestException, Injectable } from '@nestjs/common';
import { PexService } from 'src/pex/pex.service';
import { ServersService } from 'src/servers/servers.service';
import { CreateCaseDto } from 'src/admin/dto/create-case.dto';
import { ShopService } from 'src/shop/shop.service';
import { CreateServerDto } from './dto/create-server.dto';
import { CreateItemsCaseDto } from './dto/create-items-case.dto';

@Injectable()
export class AdminService {
  constructor(
    private serversService: ServersService,
    private pexService: PexService,
    private shopService: ShopService,
  ) { }

  async createServer(dto: CreateServerDto, files: Express.Multer.File[]) {
    return this.serversService.create({
      ...dto,
      media: files
        .slice(1, files.length - 1)
        .map((x) => x.destination)
        .join(','),
      server_gif_path: files[0].destination,
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
    donateDto,
    kits,
    donate_image: Express.Multer.File,
    kits_images: Express.Multer.File[]
  ) {
    await this.shopService.createDonateProduct({});
    await this.shopService.createKitsForDonate();
    return {}
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
    return { new_case, case_items };
  }
  async deleteProductById(id: number) {
    return await this.shopService.deleteProductById(id);
  }
}
