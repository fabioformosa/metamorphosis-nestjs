import { Test, TestingModule } from '@nestjs/testing';
import { ConversionService } from '../src/metamorphosis.service';
import { Convert, Converter } from '@fabio.formosa/metamorphosis';
import { MetamorphosisModule } from '../src/metamorphosis.module';

class Car {

  model: string;
  color: string;
  manufacturer: Manufacturer;

  constructor(model: string, color: string, manufacturer: Manufacturer) {
    this.model = model;
    this.color = color;
    this.manufacturer = manufacturer
  }
}

class CarDto{
  model: string;
  color: string;
  manufacturerName: string;
}

@Convert(Car, CarDto)
export default class ConverterTest implements Converter<Car, CarDto> {
  
  public convert(source: Car): CarDto {
    const target = new CarDto();
    target.color = source.color;
    target.model = source.model;
    target.manufacturerName = source.manufacturer.name;
    return target;
  }

}

class Manufacturer {
  name: string;
  country: string;

  constructor(name: string, country: string) {
    this.name = name;
    this.country = country;
  }
}

describe('MetamorphosisNestService', () => {
  let service: ConversionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MetamorphosisModule.register({logger: true})],
      providers: [ConverterTest]
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
