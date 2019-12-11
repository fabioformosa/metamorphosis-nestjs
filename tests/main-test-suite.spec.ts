import { Test, TestingModule } from '@nestjs/testing';
import { ConversionService } from '../src/metamorphosis.service';
import { MetamorphosisModule } from '../src/metamorphosis.module';
import CarToCarDtoConverter from './converters/car-to-carDto.converter';
import CarTestFactory from './car-test-factory';


describe('MetamorphosisNestService', () => {
  const injectables = {
    conversionService: {}
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MetamorphosisModule.register({logger: true})],
      providers: [CarToCarDtoConverter]
    }).compile();

    injectables.conversionService = module.get<ConversionService>(ConversionService);
  });

  it('should convert a class in another one', CarTestFactory.getSimpleTest(injectables));

  it('should convert an array in another one', CarTestFactory.getArrayTest(injectables));
  
});


