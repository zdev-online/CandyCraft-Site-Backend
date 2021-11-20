import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
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
            name: _case.name,
            image: _case.image,
            rare: _case.rare,
            position: _case.position,
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
            name: donate.name,
            servers_id: donate.servers_id,
            desc_private: donate.desc_private,
            desc_flags: donate.desc_flags,
            commands: donate.commands,
            can_enter_full_server: donate.can_enter_full_server,
            can_save_inventory: donate.can_save_inventory,
            position: donate.position,
            kits,
          },
        });
      }
    }
    return result;
  }

  async buy(id: number, @User() user: UserFromRequest) {
    let userData = await this.usersEntity.findByPk(user.id);
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
      }
      if (product.type == 'case') {
      }
      await transaction.commit();
      return { message: 'Товар успешно преобретен', id };
    } catch (e) {
      await transaction.rollback();
      throw new InternalServerErrorException({
        message: 'Что-то пошло не так',
      });
    }
  }

  async createDonateProduct(dto: CreateDonateDto) {
    return await this.donateEntity.create(dto);
  }

  async createCaseProduct(dto: CreateCaseDto) {
    return await this.caseEntity.create(dto);
  }

  async createItemsForCase(dto: CreateItemsDto[]) {
    for (let i = 0; i < dto.length; i++) {
      await this.itemsEntity.create(dto[i]);
    }
    return dto;
  }

  async createKitsForDonate(dto: CreateKitDto) {
    return await this.kitEntity.create(dto);
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
}
