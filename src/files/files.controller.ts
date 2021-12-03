import {
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import e from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Admin } from 'src/auth/admin.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { ConfirmedEmail } from 'src/auth/confirmed-email.decorator';
import { v4 } from 'uuid';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private fileService: FilesService) {}

  @Admin()
  @ConfirmedEmail()
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'files',
          maxCount: 100,
        },
      ],
      {
        fileFilter: (req: e.Request, file: Express.Multer.File, callback) => {
          let accepted_filetypes = ['png', 'jpeg', 'jpg', 'mp4', 'gif'];
          let filetype: string = extname(file.originalname).replace('.', '');
          return callback(null, accepted_filetypes.includes(filetype));
        },
        storage: diskStorage({
          destination: 'uploads/',
          filename: (req: e.Request, file: Express.Multer.File, callback) => {
            let filename: string = v4();
            return callback(null, filename);
          },
        }),
      },
    ),
  )
  @Post('/upload')
  async uploadFile(@UploadedFiles() files: Express.Multer.File[]) {
    return await this.fileService.save(files);
  }
}
