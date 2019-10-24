![](https://travis-ci.org/fabioformosa/metamorphosis-nest.svg?branch=master)

# METAMORPHOSIS-NEST
**Metamorphosis** is set of libraries that provide utilities to convert objects from a class to another one. Tipically you'll have to convert entities to DTOs and/or viceversa.

**Metamorphosis-nest** is the NodeJs version of Metamorphosis library, and it has been adapted to the popular framework [NestJS](https://nestjs.com). This module exports a conversion service, that you can import and use into your application as hub of all convertions.

## QUICK START

### INSTALL
npm install --save @fabio.formosa/metamorphosis-nest

### IMPORT MODULE

```
import { MetamorphosisNestModule } from '@fabio.formosa/metamorphosis-nest';

@Module({
  imports: [MetamorphosisNestModule],
  ...
}
export class MyApp{
}
```

### NEW CONVERTER

Create a new converter class, implementing the interface `Converter<Source, Target>` and decorate the class with `@Convert`

```
import { Convert, Converter } from '@fabio.formosa/metamorphosis';

@Injectable()
@Convert(Car, CarDto)
export default class CarToCarDtoConverter implements Converter<Car, CarDto> {
  
  public convert(source: Car): CarDto {
    const target = new CarDto();
    target.color = source.color;
    target.model = source.model;
    target.manufacturerName = source.manufacturer.name;
    return target;
  }

}
```
In the above example, the converter is `@Injectable()`, so is a NestJs Service.

### USE CONVERSION SERVICE
When your converters are instanciated by NestJs, they will be registered into the `conversion service`.
The `conversion service` is the hub for all conversions. You can inject it and invoke the convert method.

```
import { ConversionService } from '@fabio.formosa/metamorphosis-nest';

@Injectable()
class CarService{

  constructor(private convertionService: ConvertionService){}

  public getCar(id: string): CarDto{
      const car: Car = this.getCar(id);
      return <CarDto> this.convertionService.convert(car, CarDto);
  }

}
```

### TYPEGOOSE SUPPORT
Todo

## REQUIREMENTS
* TypeScript 3.2+
* Node 8.10+
* emitDecoratorMetadata and experimentalDecorators must be enabled in tsconfig.json
