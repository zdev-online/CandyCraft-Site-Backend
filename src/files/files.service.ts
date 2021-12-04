import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { unlinkSync } from 'fs';
import { extname } from 'path';
import { join } from 'path';
import { Op } from 'sequelize';
import { Files } from './files.entity';

@Injectable()
export class FilesService {
  constructor(@InjectModel(Files) private filesEntity: typeof Files) {}

  async save(files: Express.Multer.File[]) {
    let promises = files.map((x) =>
      this.filesEntity.create({
        uuid: x.filename.replace(extname(x.filename), ''),
        filename: x.filename,
        filepath: x.destination,
      }),
    );

    let results = (await Promise.allSettled(promises)).map((x) =>
      x.status == 'fulfilled'
        ? { ...x, value: x.value }
        : { ...x, reason: x.reason },
    );
    if (results.some((x) => x.status == 'rejected')) {
      await this.deleteFromDisk(files.map((x) => x.filename));
      await this.deleteFromDB(files.map((x) => x.filename));
      throw new InternalServerErrorException({
        message: 'Не удалось загрузить файлы',
        desc: 'Подробную ошибку ищите в логах сервера',
      });
    }
    return results.map((x) => (x.status == 'fulfilled' ? x.value : null));
  }

  async deleteFromDisk(filenames: string[]) {
    try {
      filenames.forEach((x) =>
        unlinkSync(join(__dirname, '..', '..', 'uploads', x)),
      );
      return {
        message: `Файлы ${filenames.join(', ')} - успешно удалёны с диска`,
      };
    } catch (e) {
      console.error(`Не удалось удалить файлы c диска - причина: ${e.message}`);
      throw new InternalServerErrorException({
        message: 'Не удалось удалить файлы',
        desc: 'Посмотрите логи',
      });
    }
  }

  async deleteFromDB(filenames: string[]) {
    try {
      await this.filesEntity.destroy({
        where: {
          [Op.or]: filenames.map((x) => ({ filename: x })),
        },
      });
      return {
        message: `Файлы ${filenames.join(', ')} - успешно удалены из базы`,
      };
    } catch (e) {
      console.error(`Не удалось удалить файлы c бд - причина: ${e.message}`);
      throw new InternalServerErrorException({
        message: 'Не удалось удалить файлы',
        desc: 'Посмотрите логи',
      });
    }
  }
}
