import { TestingModule, Test } from '@nestjs/testing';
import { MetamorphosisModule } from '../src/metamorphosis.module';
import { ConversionService } from '../src/metamorphosis.service';
import ProductConverterTest from './converters/product-to-productDto.converter';
import * as path from 'path';
import { Product } from './entities/product';
import { ConnectionOptions, createConnection, Repository, Connection } from 'typeorm';
import ProductDto from './dtos/product.dto';
import { Database } from 'sqlite3';
const sqlite3 = require('sqlite3')

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

createDb();

let conversionService: ConversionService;
let productRepository: Repository<Product>;
let connection: Connection;

describe('Conversion with typegoose', () => {

  beforeAll(async () => {
    connection = await createConnection(options);
    productRepository = connection.getRepository(Product);
  });
  
  afterAll(async () => {
    db.close();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MetamorphosisModule.register({logger: true})],
      providers: [ProductConverterTest]
    }).compile();

    conversionService = module.get<ConversionService>(ConversionService);
  });

  
  it('should convert a typeorm entity into a dto', async () => {
    let product = new Product();
    product.name = 'smartphone';
    product.pieces = 50;
    product = await productRepository.save(product);
    
    const productDto: ProductDto = <ProductDto> await conversionService.convert(product, ProductDto);

    expect(productDto.id).toBe(product.id);
    expect(productDto.name).toBe(product.name);
  });


});