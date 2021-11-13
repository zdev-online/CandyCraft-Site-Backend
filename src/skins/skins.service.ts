import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as formData from 'form-data';
import { createReadStream } from 'fs';
import path from 'path';
import { ValidateSkinDto } from './dto/validate-skin.dto';

@Injectable()
export class SkinsService {
    async isValidSkin(dto: ValidateSkinDto): Promise<boolean> {
        try {
            let form = new formData();
            form.append('file', createReadStream(path.join(dto.file.destination, dto.file.filename)))
            let data = await axios.post('https://api.mineskin.org/generate/upload', form, {
                headers: form.getHeaders()
            });
            return !!data.data.data.texture;
        } catch (e) {
            return false;
        }
    }
}
