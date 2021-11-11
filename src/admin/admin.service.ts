import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
    constructor(){}

    create(dto){}
    delete(serverId: number){}
    deactivate(serverId: number){}
    edit(serverId: number){}
    find(serverId: number){}
    findAll(){}
}
