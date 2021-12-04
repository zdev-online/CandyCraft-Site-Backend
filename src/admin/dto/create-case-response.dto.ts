import { ApiProperty } from '@nestjs/swagger';
import { Case } from "src/shop/case.entity";
import { Items } from "src/shop/items.entity";
import { Product } from "src/shop/product.entity";

export class CreateCaseResponseDto {
  @ApiProperty()
  items: Items[];

  @ApiProperty()
  product: Product;

  @ApiProperty()
  case: Case;
  
  @ApiProperty()
  message: string;
}