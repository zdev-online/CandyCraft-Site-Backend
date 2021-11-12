import { Injectable } from '@nestjs/common';
import { UserFromRequest } from 'src/users/dto/user-from-req.dto';

@Injectable()
export class ShopService {
    async buy(user: UserFromRequest, product_id: number){}
    async findAll(order_by: number){}
    async find(id:number){}
}