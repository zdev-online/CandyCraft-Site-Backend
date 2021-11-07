import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { Users } from './users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users) private usersEntity: typeof Users) {}

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

  isValidPassword(candidate: string, password: string): boolean {
    return bcrypt.compareSync(candidate, password);
  }

  private hashPassword(password: string) {
    return bcrypt.hashSync(password, 15);
  }
}
