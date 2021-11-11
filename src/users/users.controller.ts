import { Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { ConfirmedEmail } from 'src/auth/confirmed-email.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UsersService } from './users.service';
import { diskStorage } from 'multer';
import { Request } from 'express';
import { User } from './user.decorator';
import { Users } from './users.entity';
import { UserFromRequest } from './dto/user-from-req.dto';

@UseGuards(AuthGuard)
@ConfirmedEmail()
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService){}

    @Post('/change/password')
    async changePassword(@Body() changePasswordDto: ChangePasswordDto, @User() user: UserFromRequest){
        return await this.userService.changePassword(user, changePasswordDto);
    }


    @UseInterceptors(FileInterceptor('skin', {
        storage: diskStorage({
            destination: `uploads`,
            filename: (req: Request, file: Express.Multer.File, callback) => {
                let user = (req as any).user;
                return callback(null, `${user.uuid}.png`);
            }
        })
    }))
    @Post('/change/skin')
    changeSkin(@UploadedFile() file: Express.Multer.File, @User() user: UserFromRequest){
        return this.userService.changeSkin(user, file);
    }
}
