import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../product.entity';

export class BuyProductResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  product: Product;

  @ApiProperty()
  data: any;
}
