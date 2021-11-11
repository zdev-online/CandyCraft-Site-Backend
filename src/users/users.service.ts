import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { Users } from './users.entity';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserFromRequest } from './dto/user-from-req.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users) private usersEntity: typeof Users) {}
  
  async changePassword(user: UserFromRequest, dto: ChangePasswordDto){
    let data = await this.usersEntity.findByPk(user.id);
    if(!this.isValidPassword(dto.old_password, data.password)){
      throw new BadRequestException({ message: 'Неверный пароль' });
    }
    if(dto.new_password != dto.new_password_confirm){ 
      throw new BadRequestException({ message: 'Пароли не совпадают' });
    }
    data.password = this.hashPassword(dto.new_password);
    await data.save();
    return { message: 'Пароль успешно сменен' }
  }
  
  async changeSkin(user: UserFromRequest, file: Express.Multer.File){}

  async create(user: CreateUserDto): Promise<Users> {
    let new_user = await this.usersEntity.create({
      ...user,
      password: this.hashPassword(user.password),
    });
    return new_user;
  }

  async findById(id: number): Promise<Users> {
    let user = await this.usersEntity.findByPk(id);
    return user;
  }

  async findByEmailAndUsername(
    email: string,
    username: string,
  ): Promise<Users> {
    let user = await this.usersEntity.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });
    return user;
  }

  async findByEmail(email: string): Promise<Users> {
    let user = await this.usersEntity.findOne({
      where: {
        email,
      },
    });
    return user;
  }

  async deleteManyByIds(userIds: number[]): Promise<number> {
    const deleted = await this.usersEntity.destroy({
      where: {
        [Op.or]: (() => {
          const queryArray = [];
          for (let i = 0; i < userIds.length; i++) {
            queryArray.push({
              userId: userIds[i],
              confirmed: false,
            });
          }
          return queryArray;
        })(),
      },
    });
    return deleted;
  }

  isValidPassword(candidate: string, password: string): boolean {
    return bcrypt.compareSync(candidate, password);
  }

  hashPassword(password: string) {
    return bcrypt.hashSync(password, 15);
  }
}
