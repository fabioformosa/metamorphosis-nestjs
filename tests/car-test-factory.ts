import { ConversionService } from '../src/metamorphosis.service';
import Manufacturer from "./models/manufacturer";
import Car from "./models/car";
import CarDto from "./dtos/car.dto";

const TestFactory = {
    getSimpleTest: (injectables: any): jest.ProvidesCallback => {
      return async () => {
        const conversionService: ConversionService = injectables.conversionService;  
        expect(conversionService).toBeDefined();
    
        const ferrari = new Manufacturer('Ferrari', 'Italy');
        const car = new Car('purosangue', 'red', ferrari);

        const carDto = <CarDto> await conversionService.convert(car, CarDto);

        expect(carDto.color).toBe('red');
        expect(carDto.model).toBe('purosangue');
        expect(carDto.manufacturerName).toBe('Ferrari');
      }
    },
    getArrayTest: (injectables: any): jest.ProvidesCallback => {
        return async () => {
          const conversionService: ConversionService = injectables.conversionService;  
          expect(conversionService).toBeDefined();

          const ferrari = new Manufacturer('Ferrari', 'Italy');
          const car1 = new Car('purosangue', 'red', ferrari);
          const car2 = new Car('testarossa', 'black', ferrari);
        
          const cars = [car1, car2];

          const carDtos: CarDto[] = <CarDto[]> await conversionService.convertAll(cars, CarDto);

          const [carDto1, carDto2] = carDtos;

          expect(carDto1.color).toBe('red');
          expect(carDto1.model).toBe('purosangue');
          expect(carDto1.manufacturerName).toBe('Ferrari');
          expect(carDto2.color).toBe('black');
          expect(carDto2.model).toBe('testarossa');
          expect(carDto2.manufacturerName).toBe('Ferrari');
        }
    }
  };

export default TestFactory;