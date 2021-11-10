import { Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { ConfirmedEmail } from 'src/auth/confirmed-email.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UsersService } from './users.service';
import { diskStorage } from 'multer';
import { Request } from 'express';

@UseGuards(AuthGuard)
@ConfirmedEmail()
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService){}

    @Post('/change/password')
    async changePassword(@Body() changePasswordDto: ChangePasswordDto){
        return await this.userService.changePassword(changePasswordDto);
    }


    @UseInterceptors(FileInterceptor('skin', {
        storage: diskStorage({
            destination: `uploads`,
            filename: (req: Request, file: Express.Multer.File, callback) => {
                return callback(null, ``);
            }
        })
    }))
    @Post('/change/skin')
    changeSkin(@UploadedFile() file: Express.Multer.File){}
}
