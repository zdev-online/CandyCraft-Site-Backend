import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { QueryTypes, Sequelize } from 'sequelize';
import { IEntity } from './entity.interface';
import { Inheritance } from './inheritance.interface';
import { IPermissions } from './permissions.interface';

@Injectable()
export class PexService {
  constructor(@InjectConnection() private connection: Sequelize) {}

  // Добавить группу прав (e.g VIP, Premium, Titan)
  async addPermissionsGroup(
    prefix: string,
    groupName: string,
    permissions: string[],
  ) {
    await this.createEntity(prefix, { default: 0, type: 0, name: groupName });
    await this.createPermissions(
      prefix,
      { name: groupName, world: '', value: '', type: 0 },
      permissions,
    );
    return { name: groupName, permissions };
  }

  // Добавить права к группе (e.g modifyworld.*)
  async addPermissionsToGroup(
    prefix: string,
    groupName: string,
    permissions: string[],
  ) {
    await this.createPermissions(
      prefix,
      { name: groupName, world: '', value: '', type: 0 },
      permissions,
    );
    return { name: groupName, permissions };
  }

  // Добавить игроку группу прав (e.g Zharckov - VIP)
  async addPlayerToGroup(prefix: string, uuid: string, groupName: string) {
    await this.createEntity(prefix, { name: uuid, type: 1, default: 0 });
    await this.createInheritance(prefix, {
      child: uuid,
      parent: groupName,
      type: 1,
      world: null,
    });
    let permissions = await this.findPermsByGroupName(prefix, groupName);
    return {
      uuid,
      groupName,
      permissions,
    };
  }

  // Удалить группу прав
  async deletePermissionsGroup(prefix: string, groupName: string) {
    let transaction = await this.connection.transaction();
    try {
      let players: Inheritance[] = (await this.connection.query(
        {
          query: `SELECT * FROM ${prefix}_pex_inheritance WHERE parent = ?`,
          values: [groupName],
        },
        {
          type: QueryTypes.SELECT,
        },
      )) as any;
      let deletePlayersQuery: string[] = [];
      for (let i = 0; i < players.length; i++) {
        deletePlayersQuery.push(`name = ${players[i].child}`);
      }
      this.connection.query(
        {
          query: `DELETE * FROM ${prefix}_pex_entity WHERE name = ?`,
          values: [groupName],
        },
        {
          type: QueryTypes.DELETE,
          transaction,
        },
      );
      players.length &&
        (await this.connection.query(
          {
            query: `DELETE * FROM ${prefix}_pex_inheritance WHERE parent = ? AND ${players
              .map((x) => `child = ${x.child}`)
              .join(' OR')}`,
            values: [groupName],
          },
          {
            type: QueryTypes.DELETE,
            transaction,
          },
        ));
      await this.connection.query(
        {
          query: `DELETE * FROM ${prefix}_pex_permissions WHERE name = ?`,
          values: [groupName],
        },
        {
          type: QueryTypes.DELETE,
          transaction,
        },
      );
      await transaction.commit();
      return true;
    } catch (e) {
      await transaction.rollback();
      return false;
    }
  }

  // Удалить права из группы
  deletePermissionsFromGroup(
    prefix: string,
    groupName: string,
    delete_perms: string[],
  ) {
    for (let i = 0; i < delete_perms.length; i++) {
      this.connection.query({
        query: `DELETE FROM ${prefix}_pex_permissions WHERE name = ? AND permission = ?`,
        values: [groupName, delete_perms[i]],
      });
    }
    return true;
  }

  // Удалить права у игрока
  async deletePlayerFromGroup(prefix: string, uuid: string, groupName: string) {
    await this.connection.query(
      {
        query: `DELETE FROM ${prefix}_pex_inheritance WHERE child = ? AND parent = ?`,
        values: [uuid, groupName],
      },
      { type: QueryTypes.DELETE },
    );
    return true;
  }

  // Найти группу по названию
  async findPermsByGroupName(
    prefix: string,
    groupName: string,
  ): Promise<string[]> {
    const group: IPermissions[] = (await this.connection.query({
      query: `SELECT * FROM ${prefix}_pex_permissions WHERE name = ?`,
      values: [groupName],
    })) as any;
    const result = [];
    for (let i = 0; i < group.length; i++) {
      let { permission } = group[i];
      result.push(permission);
    }
    return result;
  }

  // Найти игроков, которые в определенной группе
  async findPlayersByGroup(prefix: string, groupName: string) {
    let result = (await this.connection.query(
      {
        query: `SELECT * FROM ${prefix}_pex_inheritance, ${prefix}_pex_permissions WHERE ${prefix}_pex_inheritance.parent = ${prefix}_pex_permissions.name AND ${prefix}_pex_inheritance.parent = ?`,
        values: [groupName],
      },
      { type: QueryTypes.SELECT },
    )) as any;
    let data = result as (Inheritance & IPermissions)[];
    let players = [];
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < players.length; j++) {
        if (data[i].child == players[j].uuid) {
          players[j].permissions.push(data[i].permission);
        } else {
          players.push({ uuid: data[i].child, permissions: [] });
        }
      }
    }
    return { group: groupName, players };
  }

  // Найти игроков по ID
  async findPlayersById(prefix: string, uuid: string) {
    let result = await this.connection.query(
      {
        query: `SELECT * FROM ${prefix}_pex_inheritance WHERE child = ?`,
        values: [uuid],
      },
      { type: QueryTypes.SELECT },
    );
    let player: Inheritance = result[0] as Inheritance;
    let permissions = await this.findPermsByGroupName(prefix, player.parent);
    return { uuid, permissions };
  }

  /* 
        type: 
            0 - группа
            1 - игрок
        default: 0
        name: uuid игрока или имя группы
    */
  private async createEntity(
    prefix: string,
    options: Omit<IEntity, 'id'>,
  ): Promise<IEntity> {
    const [id] = await this.connection.query(
      {
        query: `INSERT INTO ${prefix}_pex_entity (name,type,default) VALUES (?,?,?)`,
        values: [options.name, options.type, options.default],
      },
      {
        type: QueryTypes.INSERT,
      },
    );
    const result = await this.connection.query(
      `SELECT * FROM ${prefix}_pex_entity WHERE id = ${id}`,
      {
        type: QueryTypes.SELECT,
      },
    );
    return result[0] as any;
  }

  /*  
        child: uuid - игрока
        parent: имя группы
        type: 1
        world: null
    */
  private async createInheritance(
    prefix: string,
    options: Omit<Inheritance, 'id'>,
  ): Promise<Inheritance> {
    const [id] = await this.connection.query(
      {
        query: `INSERT INTO ${prefix}_pex_inheritance (child,parent,type,world) VALUES (?,?,?,?)`,
        values: [options.child, options.parent, options.type, options.world],
      },
      {
        type: QueryTypes.INSERT,
      },
    );
    const result = await this.connection.query(
      `SELECT * FROM ${prefix}_pex_inheritance WHERE id = ${id} LIMIT 1`,
      {
        type: QueryTypes.SELECT,
      },
    );
    return result[0] as any;
  }

  /*
        name: Имя группы
        type: 0
        permission: одно разрешение
        world: ""
        value: ""
    */
  private async createPermissions(
    prefix: string,
    options: Omit<IPermissions, 'id' | 'permission'>,
    permissions: string[],
  ): Promise<IPermissions[]> {
    const values_length: string[] = [];
    for (let i = 0; i < permissions.length; i++) {
      values_length.push('(?,?,?,?,?)');
    }
    const [id] = await this.connection.query(
      {
        query: `INSERT INTO ${prefix}_pex_permissions (name,type,permission,world,value) VALUES ${values_length.join(
          ',',
        )}`,
        values: permissions.map((x) => [
          options.name,
          options.type,
          x,
          options.world,
          options.value,
        ]),
      },
      {
        type: QueryTypes.INSERT,
      },
    );
    return (await this.connection.query(
      `SELECT * FROM ${prefix}_pex_permissions WHERE name = ${options.name}`,
      {
        type: QueryTypes.SELECT,
      },
    )) as any;
  }
}
