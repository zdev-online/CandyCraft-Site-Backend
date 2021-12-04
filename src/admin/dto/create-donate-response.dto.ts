import { ApiProperty } from '@nestjs/swagger';
import { Donate } from "src/shop/donate.entity";
import { Kit } from "src/shop/kit.entity";
import { Product } from "src/shop/product.entity";

export class CreateDonateResponseDto {
  @ApiProperty()
  kits: Kit[];

  @ApiProperty()
  product: Product;

  @ApiProperty()
  donate: Donate;

  @ApiProperty()
  message: string;
}