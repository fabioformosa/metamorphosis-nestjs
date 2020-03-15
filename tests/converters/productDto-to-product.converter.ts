import { Convert, Converter } from "@fabio.formosa/metamorphosis";
import { Injectable } from "@nestjs/common";
import { Product } from "../entities/product";
import ProductDto from "../dtos/product.dto";
import { Repository, Connection } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
@Convert(ProductDto, Product)
export default class ProductDtoConverterTest implements Converter<ProductDto, Promise<Product>> {

  // constructor( 
  //   @InjectRepository(Product) 
  //   private readonly productRepository: Repository<Product>){
  //   console.log('Creating converter from ProductDto to Product');
  // }

  constructor(private readonly connection: Connection){
    
  }

  public async convert(source: ProductDto): Promise<Product> {
    const productRepository: Repository<Product> = this.connection.getRepository(Product);
    const target: Product | undefined = await productRepository.findOne(source.id);
    if(!target)
      throw new Error(`not found any product by id ${source.id}`);
    target.name = source.name;
    return target;
  }

}