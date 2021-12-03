import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilesController } from './files.controller';
import { Files } from './files.entity';
import { FilesService } from './files.service';

@Module({
  imports: [SequelizeModule.forFeature([Files])],
  controllers: [FilesController],
  providers: [FilesService]
})
export class FilesModule {}
