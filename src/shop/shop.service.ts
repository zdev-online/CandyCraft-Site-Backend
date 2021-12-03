import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import { PexService } from 'src/pex/pex.service';
import { ServersService } from 'src/servers/servers.service';
import { UserFromRequest } from 'src/users/dto/user-from-req.dto';
import { User } from 'src/users/user.decorator';
import { Users } from 'src/users/users.entity';
import { Case } from './case.entity';
import { Donate } from './donate.entity';
import { CreateCaseDto } from './dto/create-case.dto';
import { CreateDonateDto } from './dto/create-donate.dto';
import { CreateItemsDto } from './dto/create-items.dto';
import { CreateKitDto } from './dto/create-kit.dto';
import { Items } from './items.entity';
import { Kit } from './kit.entity';
import { Product } from './product.entity';

@Injectable()
export class ShopService {
  constructor(
    @InjectConnection() private connection: Sequelize,
    @InjectModel(Case) private caseEntity: typeof Case,
    @InjectModel(Product) private productEntity: typeof Product,
    @InjectModel(Donate) private donateEntity: typeof Donate,
    @InjectModel(Items) private itemsEntity: typeof Items,
    @InjectModel(Kit) private kitEntity: typeof Kit,
    @InjectModel(Users) private usersEntity: typeof Users,
    private pexService: PexService,
    private serversService: ServersService,
  ) {}

  async findAll() {
    let result = [];
    let products = await this.productEntity.findAll();
    for (let i = 0; i < products.length; i++) {
      let { id, product_id, type } = products[i];
      if (type == 'case') {
        let _case = await this.caseEntity.findByPk(product_id);
        let items = await this.itemsEntity.findAll({
          where: {
            case_id: product_id,
          },
        });
        result.push({
          id,
          type: 'case',
          data: {
            case: {
              name: _case.name,
              image: _case.image,
              position: _case.position,
            },
            items,
          },
        });
      }
      if (type == 'donate') {
        let donate = await this.donateEntity.findByPk(product_id);
        let kits = await this.kitEntity.findAll({
          where: {
            donate_id: product_id,
          },
        });
        result.push({
          id,
          type: 'donate',
          data: {
            donate: {
              name: donate.name,
              servers_id: donate.servers_id,
              desc_private: donate.desc_private,
              desc_flags: donate.desc_flags,
              commands: donate.commands,
              can_enter_full_server: donate.can_enter_full_server,
              can_save_inventory: donate.can_save_inventory,
              position: donate.position,
            },
            kits,
          },
        });
      }
    }
    return result;
  }

  async buy(id: number, serverId: number, @User() user: UserFromRequest) {
    // Поиск сервера
    let data: any;
    let server = await this.serversService.findById(serverId);
    if (!server) {
      throw new BadRequestException({
        message: 'Неверный ID - сервера',
      });
    }
    let userData = await this.usersEntity.findByPk(user.id);
    // Поиск товара
    let product = await this.productEntity.findByPk(id);
    if (!product) {
      throw new BadRequestException({
        message: 'Товар с таким ID - не найден',
      });
    }
    if (product.price > userData.money) {
      throw new BadRequestException({ message: 'Недостаточно денег' });
    }
    const transaction = await this.connection.transaction();
    try {
      if (product.type == 'donate') {
        let donateProduct = await this.donateEntity.findByPk(
          product.product_id,
        );
        if (!donateProduct) {
          throw new BadRequestException({
            message: 'Не товар найден',
          });
        }
        if (!donateProduct.servers_id.split(',').includes(String(serverId))) {
          throw new BadRequestException({
            message: 'Нельзя купить донат для этого сервера',
          });
        }
        await this.pexService.addPlayerToGroup(
          server.pex_prefix,
          userData.uuid,
          donateProduct.pex_name,
        );
        data = {
          ...donateProduct,
          pex_name: undefined,
        };
      }
      if (product.type == 'case') {
        let caseProduct = await this.caseEntity.findByPk(product.product_id);
        if (!caseProduct) {
          throw new BadRequestException({
            message: 'Не товар найден',
          });
        }
        // Выдаем кейс

        // await

        // Выдаем кейс
        data = {
          id: caseProduct.id,
          name: caseProduct.name,
          image: caseProduct.image,
          position: caseProduct.position,
        };
      }
      await transaction.commit();
      return { message: 'Товар успешно преобретен', product, data };
    } catch (e) {
      await transaction.rollback();
      throw new InternalServerErrorException({
        message: 'Что-то пошло не так',
      });
    }
  }

  async createDonateProduct(dto: CreateDonateDto, price: number) {
    let donate = await this.donateEntity.create(dto);
    let product = await this.productEntity.create({
      type: 'donate',
      product_id: donate.id,
      price,
    });
    return {
      product,
      donate,
    };
  }

  async createCaseProduct(dto: CreateCaseDto, price: number) {
    let _case = await this.caseEntity.create(dto);
    let product = await this.productEntity.create({
      type: 'case',
      product_id: _case.id,
      price,
    });
    return {
      product: product,
      case: _case,
    };
  }

  async createItemsForCase(dto: CreateItemsDto[]): Promise<Items[]> {
    let items: Items[] = [];
    for (let i = 0; i < dto.length; i++) {
      let item = await this.itemsEntity.create(dto[i]);
      items.push(item);
    }
    return items;
  }

  async createKitsForDonate(dtos: CreateKitDto[]): Promise<Kit[]> {
    let kits: Kit[] = [];
    for (let i = 0; i < dtos.length; i++) {
      let kit = await this.kitEntity.create(dtos[i]);
      kits.push(kit);
    }
    return kits;
  }

  async deleteProductById(id: number) {
    let product = await this.productEntity.findByPk(id);
    if (!product) {
      throw new BadRequestException({
        message: 'Товар с таким ID - не найден',
      });
    }
    product.type == 'donate' &&
      (await this.donateEntity.destroy({ where: { id: product.product_id } }));
    product.type == 'case' &&
      (await this.caseEntity.destroy({ where: { id: product.id } }));
    await product.destroy();
    return product;
  }

  async getFullProducts() {
    let products = await this.productEntity.findAll();

    let donates = await this.donateEntity.findAll();
    let kits = await this.kitEntity.findAll();

    let cases = await this.caseEntity.findAll();
    let items = await this.itemsEntity.findAll();

    let data = {
      donate: [],
      cases: [],
    };

    products.forEach((x) => {
      if (x.type == 'donate') {
        let donate_ = donates.find((y) => y.id == x.product_id);
        let id = data.donate.push(donate_) - 1;
        kits.forEach((kit) => {
          if (kit.donate_id == donate_.id) {
            if (!data.donate[id].kits) {
              data.donate[id].kits = [];
            }
            data.donate[id].kits.push(kit);
          }
        });
      }
      if (x.type == 'case') {
        let case_ = cases.find((y) => y.id == x.product_id);
        let id = data.cases.push(case_) - 1;
        items.forEach((item) => {
          if (item.case_id == case_.id) {
            if (!data.cases[id].items) {
              data.cases[id].items = [];
            }
            data.cases[id].items.push(item);
          }
        });
      }
    });

    return data;
  }
}
