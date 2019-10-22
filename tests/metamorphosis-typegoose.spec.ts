import { prop, modelOptions, getModelForClass, getClassForDocument } from '@typegoose/typegoose';
import * as mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ConnectionOptions } from 'mongoose';
import { ObjectID } from 'bson';
import {plainToClass, Type} from 'class-transformer';
import { Converter, Convert } from '@fabio.formosa/metamorphosis';
import { TestingModule, Test } from '@nestjs/testing';
import { ConversionService } from '../src/metamorphosis.service';

@modelOptions({
  existingMongoose: mongoose,
  schemaOptions: { collection: 'players' },
})

class Team{
  _id: ObjectID;
  
  @prop({require : true})
  name: string;
  
  @prop({require : true})
  city: string;
}
class Player{
    _id: ObjectID;

    @prop({require : true})
    name: string;
    
    @prop()
    score: number;
    
    @Type(() => Team)
    @prop({require : true})
    team: Team;
  }
  

class PlayerDto{
  id: string;
  name: string;
  team: string;
}

class TeamDto{
  id: string;
  name: string;
  city: string;
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
class PlayerConverterTest implements Converter<Player, PlayerDto> {
  
  public convert(source: Player): PlayerDto {
    const target = new PlayerDto();
    target.id = source._id.toString();
    target.name = source.name;
    target.team = source.team.name;
    return target;
  }

}

@Convert(Team, TeamDto)
class TeamConverterTest implements Converter<Team, TeamDto> {
  
  public convert(source: Team): TeamDto {
    const target = new TeamDto();
    target.id = source._id.toString();
    target.name = source.name;
    target.city = source.city;
    return target;
  }

}

const playerConverterTest = new PlayerConverterTest();
const teamConverterTest = new TeamConverterTest();
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
        score: 100,
        team: { name: 'Inter', city: 'Milan'}
      });
      player.save();

      const foundPlayerModel = await PlayerModel.findOne({'name': 'Baggio'}).exec() || player;
      expect(foundPlayerModel).toBeDefined();
      expect(foundPlayerModel.team).toBeDefined();

      const playerDto = conversionService.convert(foundPlayerModel, PlayerDto);
      expect(playerDto).toBeDefined();
      expect(playerDto).toHaveProperty('id');
      expect(playerDto.name).toBe('Baggio');
      

      const foundPlayer = plainToClass(Player, foundPlayerModel.toObject());
      console.log

      const teamDto = conversionService.convert(foundPlayer.team, TeamDto);
      expect(teamDto).toBeDefined();
      expect(teamDto).toHaveProperty('id');
      expect(teamDto.name).toBe('Inter');
      expect(teamDto.city).toBe('Milan');


    });

});