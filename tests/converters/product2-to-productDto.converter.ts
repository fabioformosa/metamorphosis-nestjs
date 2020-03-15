import { Convert, Converter } from "@fabio.formosa/metamorphosis";
import { Injectable } from "@nestjs/common";
import { Product2 } from "../entities/product2";
import ProductDto from "../dtos/product.dto";

@Injectable()
@Convert(Product2, ProductDto)
export default class Product2ConverterTest implements Converter<Product2, ProductDto> {

  constructor(){
    console.log('Creating converter from Product to ProductDto');
  }

  public convert(source: Product2): ProductDto {
    const target = new ProductDto();
    target.id = source.id;
    target.name = source.name;
    return target;
  }

}