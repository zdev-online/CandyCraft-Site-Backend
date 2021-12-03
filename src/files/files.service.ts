import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { unlinkSync } from 'fs';
import { extname } from 'path';
import { join } from 'path/posix';
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
      files.forEach(async (x) => await this.deleteFromDisk(x.filename));
      throw new InternalServerErrorException({
        message: 'Не удалось загрузить файлы',
        desc: 'Подробную ошибку ищите в логах сервера',
      });
    }
    return results.map((x) => (x.status == 'fulfilled' ? x.value : null));
  }

  async deleteFromDisk(filename: string) {
    try {
      unlinkSync(join(__dirname, '..', '..', 'uploads', filename));
      return { message: `Файл ${filename} - успешно удалён с диска` };
    } catch (e) {
      console.error(`Не удалось удалить файл c диска - причина: ${e.message}`);
      throw new InternalServerErrorException({
        message: 'Не удалось удалить файл',
        desc: 'Посмотрите логи',
      });
    }
  }

  async deleteFromDB(filename: string) {
    try {
      await this.filesEntity.destroy({
        where: {
          filename,
        },
      });
      return { message: `Файл ${filename} - успешно удален из базы` };
    } catch (e) {
      console.error(`Не удалось удалить файл c бд - причина: ${e.message}`);
      throw new InternalServerErrorException({
        message: 'Не удалось удалить файл',
        desc: 'Посмотрите логи',
      });
    }
  }
}
