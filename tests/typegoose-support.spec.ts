import { getModelForClass } from '@typegoose/typegoose';

import { plainToClass } from 'class-transformer';
import { TestingModule, Test } from '@nestjs/testing';
import { MetamorphosisModule } from '../src/metamorphosis.module';
import { ConversionService } from '../src/metamorphosis.service';
import { MongoDBHelper } from './utils/mongodb.service';
import Player from './models/player';
import PlayerDto from './dtos/player.dto';
import TeamDto from './dtos/team.dto';
import PlayerConverterTest from './converters/player-to-playerDto.converter';
import TeamConverterTest from './converters/team-to-teamDto.converter';


let conversionService: ConversionService;

describe('Conversion with typegoose', () => {

  beforeAll(async () => {
    await MongoDBHelper.connect();
  });
  
  afterAll(async () => {
    await MongoDBHelper.disconnect();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MetamorphosisModule.register()],
      providers: [PlayerConverterTest, TeamConverterTest]
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

      const teamDto = conversionService.convert(foundPlayer.team, TeamDto);
      expect(teamDto).toBeDefined();
      expect(teamDto).toHaveProperty('id');
      expect(teamDto.name).toBe('Inter');
      expect(teamDto.city).toBe('Milan');


    });

});