import { Test, TestingModule } from '@nestjs/testing';
import { MetamorphosisNestService } from '../src/metamorphosis-nest.service';
import { Convert, Converter } from '@fabio.formosa/metamorphosis';

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

const converterTest = new ConverterTest();

class Manufacturer {
  name: string;
  country: string;

  constructor(name: string, country: string) {
    this.name = name;
    this.country = country;
  }
}

describe('MetamorphosisNestService', () => {
  let service: MetamorphosisNestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MetamorphosisNestService],
    }).compile();

    service = module.get<MetamorphosisNestService>(MetamorphosisNestService);
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
