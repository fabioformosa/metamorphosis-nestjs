import { Test, TestingModule } from '@nestjs/testing';
import { ConversionService } from '../src/metamorphosis.service';
import { MetamorphosisModule } from '../src/metamorphosis.module';
import CarToCarDtoConverter from './converters/car-to-carDto.converter';
import CarTestFactory from './car-test-factory';
import TeamConverterTest from './converters/team-to-teamDto.converter';
import TeamDto from './dtos/team.dto';
import Team from './models/team';
import { ObjectID } from "bson";

describe('MetamorphosisNestService', () => {
  const injectables = {
    conversionService: {} as ConversionService
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MetamorphosisModule.register({logger: true})],
      providers: [CarToCarDtoConverter, TeamConverterTest]
    }).compile();

    injectables.conversionService = module.get<ConversionService>(ConversionService);
  });

  it('should convert a class in another one', CarTestFactory.getSimpleTest(injectables));

  it('should convert an array in another one', CarTestFactory.getArrayTest(injectables));

  it('should convert a team in to a teamDto', async () => {
    const conversionService: ConversionService = injectables.conversionService;  
    
    const team = new Team();
    team._id = new ObjectID(); 
    team.city = 'Milan';
    team.name = 'Inter';

    const teamDto = <TeamDto> await conversionService.convert(team, TeamDto);
      expect(teamDto).toBeDefined();
      expect(teamDto).toHaveProperty('id');
      expect(teamDto.name).toBe('Inter');
      expect(teamDto.city).toBe('Milan');
  });

});


