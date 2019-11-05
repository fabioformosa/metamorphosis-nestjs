import { Test, TestingModule } from '@nestjs/testing';
import { ConversionService } from '../src/metamorphosis.service';
import { MetamorphosisModule } from '../src/metamorphosis.module';
import CarDto from './dtos/car.dto';
import Car from './models/car';
import Manufacturer from './models/manufacturer';
import CarToCarDtoConverter from './converters/car-to-carDto.converter';

describe('MetamorphosisNestService', () => {
  let service: ConversionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MetamorphosisModule.register({logger: true})],
      providers: [CarToCarDtoConverter]
    }).compile();

    service = module.get<ConversionService>(ConversionService);
  });

  it('should be convert a class in another one', () => {
    expect(service).toBeDefined();

    const ferrari = new Manufacturer('Ferrari', 'Italy');
    const car = new Car('purosangue', 'red', ferrari);

    const carDto: CarDto = service.convert(car, CarDto);

    expect(carDto.color).toBe('red');
    expect(carDto.model).toBe('purosangue');
    expect(carDto.manufacturerName).toBe('Ferrari');

  });
});
