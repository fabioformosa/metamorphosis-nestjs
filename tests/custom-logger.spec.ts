import { Test, TestingModule } from '@nestjs/testing';
import { ConversionService } from '../src/metamorphosis.service';
import { MetamorphosisModule } from '../src/metamorphosis.module';
import CarToCarDtoConverter from './converters/car-to-carDto.converter';
import TestFactory from './car-test-factory';


describe('Custom Logger Test Suite', () => {
  const injectables = {
    conversionService: {}
  }

  beforeEach(async () => {
    const loggerMock = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      imports: [MetamorphosisModule.register({logger: loggerMock})],
      providers: [CarToCarDtoConverter]
    }).compile();

    injectables.conversionService = module.get<ConversionService>(ConversionService);
  });

  it('should be convert a class in another one', TestFactory.getSimpleTest(injectables));
  
});


