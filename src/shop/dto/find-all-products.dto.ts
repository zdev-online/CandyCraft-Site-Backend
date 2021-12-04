import { ApiProperty } from '@nestjs/swagger';
import { Items } from "../items.entity";
import { Kit } from "../kit.entity";

class FindAllCaseDto  {
  id: number;
  type: 'case';
  data: {
    case: {
      name: string;
      image: string;
      position: string;
    };
    items: Items[];
  }
}

class FindAllDonateDto {
  id: number;
  type: 'donate';
  data: {
    donate: {
      name: string;
      servers_id: string;
      desc_private: string;
      desc_flags: string;
      commands: string;
      can_enter_full_server: boolean;
      can_save_inventory: boolean;
      position: number;
    };
    kits: Kit[];
  }
} 

export class FindAllProductsDto {
  @ApiProperty()
  donate: FindAllDonateDto[]
  @ApiProperty()
  cases: FindAllCaseDto[]
}