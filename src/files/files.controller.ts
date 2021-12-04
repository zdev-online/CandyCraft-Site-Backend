import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import e from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Admin } from 'src/auth/admin.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { ConfirmedEmail } from 'src/auth/confirmed-email.decorator';
import { v4 } from 'uuid';
import { FilesService } from './files.service';
import { Files } from './files.entity';

@ApiBearerAuth('JWT_AUTH')
@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private fileService: FilesService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Загрузка файлов на сервер',
    summary: 'Загрузка файлов на сервер',
  })
  @ApiOkResponse({ type: [Files] })
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
  async uploadFile(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Files[]> {
    return await this.fileService.save(files);
  }
}
