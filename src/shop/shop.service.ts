import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';
import { PexService } from 'src/pex/pex.service';
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
    private pexService: PexService
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

  async createDonateProduct(dto: CreateDonateDto): Promise<Donate> {
    return await this.donateEntity.create(dto);
  }

  async createCaseProduct(dto: CreateCaseDto): Promise<Case> {
    return await this.caseEntity.create(dto);
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
    for(let i = 0; i < dtos.length; i++){
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

  async getFullProducts(){
    let products = await this.productEntity.findAll();
    
    let donates = await this.donateEntity.findAll();
    let kits = await this.kitEntity.findAll();
    
    let cases = await this.caseEntity.findAll();
    let items = await this.itemsEntity.findAll();
    
    let data = {
      donate: [],
      cases: []
    };

    products.forEach((x) => {
      if(x.type == 'donate'){
        let donate_ = donates.find(y => y.id == x.product_id);
        let id = data.donate.push(donate_) - 1;
        kits.forEach(kit => {
          if(kit.donate_id == donate_.id){
            if(!data.donate[id].kits){
              data.donate[id].kits = [];
            }
            data.donate[id].kits.push(kit);
          }
        });
      }
      if(x.type == 'case'){
        let case_ = cases.find(y => y.id == x.product_id);
        let id = data.cases.push(case_) - 1;
        items.forEach(item => {
          if(item.case_id == case_.id){
            if(!data.cases[id].items){
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
