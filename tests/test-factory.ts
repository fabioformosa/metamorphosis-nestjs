import { ConversionService } from '../src/metamorphosis.service';
import Manufacturer from "./models/manufacturer";
import Car from "./models/car";
import CarDto from "./dtos/car.dto";

const TestFactory = {
    getSimpleTest: (injectables: any): jest.ProvidesCallback => {
      return () => {
        const conversionService: ConversionService = injectables.conversionService;  
        expect(conversionService).toBeDefined();
        const ferrari = new Manufacturer('Ferrari', 'Italy');
        const car = new Car('purosangue', 'red', ferrari);
        const carDto: CarDto = conversionService.convert(car, CarDto);
        expect(carDto.color).toBe('red');
        expect(carDto.model).toBe('purosangue');
        expect(carDto.manufacturerName).toBe('Ferrari');
      }
    }
  };

export default TestFactory;