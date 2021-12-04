import { ApiProperty } from '@nestjs/swagger';
import { Case } from '../case.entity';
import { Donate } from '../donate.entity';
import { Items } from '../items.entity';
import { Kit } from '../kit.entity';

type TDonate = Donate & { kits: Kit[] };
type TCases = Case & { items: Items[] };

export class GetFullProductDto {
  @ApiProperty()
  donate: TDonate[];

  @ApiProperty()
  cases: TCases[];
}
