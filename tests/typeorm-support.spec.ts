import { TestingModule, Test } from '@nestjs/testing';
import { MetamorphosisModule } from '../src/metamorphosis.module';
import { ConversionService } from '../src/metamorphosis.service';
import ProductConverterTest from './converters/product-to-productDto.converter';
import * as path from 'path';
import { Product } from './entities/product';
import { ConnectionOptions, createConnection, Repository, Connection } from 'typeorm';
import ProductDto from './dtos/product.dto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Database } from 'sqlite3';
import ProductDtoConverterTest from './converters/productDto-to-product.converter';
const sqlite3 = require('sqlite3');


export const root: string = path.resolve(__dirname, "..")

const options: ConnectionOptions = {
  type: "sqlite",
  database: `${root}/tests/metamorphosis.sqlite3`,
  entities: [ Product ],
  logging: true
}

var db: Database;
function createDb() {
    console.log("createDb metamorphosis.sqlite3");
    db = new sqlite3.Database(`${root}/tests/metamorphosis.sqlite3`, createTable);
}


function createTable() {
    console.log("createTable product");
    db.run("CREATE TABLE IF NOT EXISTS product (id number PRIMARY KEY, name text, pieces number)");
}

let conversionService: ConversionService;
let productRepository: Repository<Product>;
let connection: Connection;

let productId: number;

beforeAll(async (done) => {
  createDb();
  db.close(async () => {
    console.log(`Closing DB to create table...`);

    console.log(`Creating TestingModule...`);
    const module: TestingModule = await Test.createTestingModule({
    imports: [
              MetamorphosisModule.register({logger: true}),
              TypeOrmModule.forRoot({
                type: 'sqlite',
                database: `${root}/tests/metamorphosis.sqlite3`,
                entities: [Product],
                synchronize: true,
              })
    ],
    providers: [ProductConverterTest, ProductDtoConverterTest]
  }).compile();

  conversionService = module.get<ConversionService>(ConversionService);
  connection = module.get<Connection>(Connection);
  productRepository = connection.getRepository(Product);

    done();
  });
});

describe('Conversion with typegoose', () => {
  
  it('should convert a typeorm entity into a dto', async () => {
    let product = new Product();
    product.name = 'smartphone';
    product.pieces = 50;
    product = await productRepository.save(product);
    
    productId = product.id;

    const productDto: ProductDto = <ProductDto> await conversionService.convert(product, ProductDto);

    expect(productDto.id).toBe(product.id);
    expect(productDto.name).toBe(product.name);
  });


  it('should convert a dto into typeorm entity', async () => {
    const productDto2 = new ProductDto();
    productDto2.id = productId;
    productDto2.name = 'mobile phone';
    
    const product2: Product = <Product> await conversionService.convert(productDto2, Product);
    productRepository.save(product2);

    expect(product2.id).toBe(productDto2.id);
    expect(product2.name).toBe(productDto2.name);
  });

});