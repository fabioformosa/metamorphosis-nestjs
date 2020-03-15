import { Convert, Converter } from "@fabio.formosa/metamorphosis";
import { Injectable } from "@nestjs/common";
import { Product } from "../entities/product";
import ProductDto from "../dtos/product.dto";

@Injectable()
@Convert(Product, ProductDto)
export default class ProductConverterTest implements Converter<Product, ProductDto> {

  constructor(){
    console.log('Creating converter from Product to ProductDto');
  }

  public convert(source: Product): ProductDto {
    const target = new ProductDto();
    target.id = source.id;
    target.name = source.name;
    return target;
  }

}