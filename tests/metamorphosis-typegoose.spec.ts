import { prop, modelOptions, getModelForClass, getClassForDocument } from '@typegoose/typegoose';
import * as mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ConnectionOptions } from 'mongoose';
import { ObjectID } from 'bson';
import { Converter, Convert } from '@fabio.formosa/metamorphosis';
import { TestingModule, Test } from '@nestjs/testing';
import { ConversionService } from '../src/metamorphosis-nest.service';

@modelOptions({
  existingMongoose: mongoose,
  schemaOptions: { collection: 'players' },
  })
class Player{
    _id: ObjectID;

    @prop({require : true})
    name: string;
    
    @prop()
    score: number;
}

class PlayerDto{
  id: string;
  name: string;
}

const connect = async (): Promise<void> => {
  console.log(`MongoDB SERVICE - Connecting to mongodb in memory...`);
  const dataSource = await getDataSource();
  console.log(`MongoDB SERVICE - Connecting to datasource ${dataSource}`);
  mongoose.set('useUnifiedTopology', true);
  const options: ConnectionOptions = {
    useNewUrlParser: true,
    connectTimeoutMS: 10000,
    useFindAndModify: false,
  };
  try {
    await mongoose.connect(dataSource, options);
    console.log(`MongoDB SERVICE - Connected to datasource ${dataSource}`);
  } catch (e) {
    console.log(`MongoDB SERVICE - Unexpected error connecting to datasource ${dataSource} due to ${e}`);
    throw e;
  }
};

const  getDataSource = async (): Promise<string> => {
  console.log(`MongoDB SERVICE - creating MongoMemoryServer...`);
  const mongoMemoryServer = new MongoMemoryServer({ debug: false });
  console.log(`MongoDB SERVICE - created MongoMemoryServer`);
  return await mongoMemoryServer.getConnectionString();
};


@Convert(Player, PlayerDto)
class ConverterTest implements Converter<Player, PlayerDto> {
  
  public convert(source: Player): PlayerDto {
    const target = new PlayerDto();
    target.id = source._id.toString();
    target.name = source.name;
    return target;
  }

}

const converterTest = new ConverterTest();
let conversionService: ConversionService;

describe('Conversion with typegoose', () => {

  beforeAll(async () => {
    await connect();
  });
  
  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConversionService],
    }).compile();

    conversionService = module.get<ConversionService>(ConversionService);
  });

  
  it('should convert a typegoose model into a dto', async () => {
      const PlayerModel = getModelForClass(Player);

      const player = await PlayerModel.create({
        name : 'Baggio', 
        score: 100
      });
      player.save();

      const foundPlayer = await PlayerModel.findOne({'name': 'Baggio'}).exec() || player;
      expect(foundPlayer).toBeDefined();

      const playerDto = conversionService.convert(foundPlayer, PlayerDto);
      expect(playerDto).toBeDefined();
      expect(playerDto).toHaveProperty('id');
      expect(playerDto.name).toBe('Baggio');

    });

});