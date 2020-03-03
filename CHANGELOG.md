## **v4.0.0** 

**BREAKING CHANGE** If you use the conversionService with typegoose, you have to import a new dependency and change the import from MetamorphosisNestModule

  ```
    npm install --save @fabio.formosa/metamorphosis-typegoose-plugin
  ```
and add plugin in MetamorphosisNestModule registration

```
    import { MetamorphosisNestModule } from '@fabio.formosa/metamorphosis-nest';
    import TypegoosePlugin from '@fabio.formosa/metamorphosis-typegoose-plugin/dist/typegoose-plugin';
    import { MetamorphosisPlugin } from '@fabio.formosa/metamorphosis';

    const typegoosePlugin = new TypegoosePlugin();

    @Module({
      imports: [MetamorphosisModule.register({logger: false, plugins: [typegoosePlugin])],
      ...
    }
    export class MyApp{
    }
```

## **v3.0.0** 

**BREAKING CHANGE** ConvertionService now returns always a Promise also if all converters are not async. So, you must add `await` before all conversionService calls.

from
```
const planet = conversionService.convert(planetDto, Planet);
  or
const carDtos: CarDto[] = this.convertionService.convertAll(cars, CarDto);
```
to
```
const planet = <Planet> await conversionService.convert(planetDto, Planet);
  or
const carDtos = <CarDto[]> await this.convertionService.convertAll(cars, CarDto);
```

## **v2.0.1** 

**FIXED** Converted some dependecies in peer dependencies

 ## **v2.0.0**

**ADDED**  array conversion method
```
const cars: Car[] = ...
const carDtos: CarDto[] =  this.convertionService.convertAll(cars, CarDto);
```

**ADDED**   debug mode. If metamorphosis is registered in debug mode, all logs are displayed in console.
```
import { MetamorphosisNestModule } from '@fabio.formosa/metamorphosis-nest';

@Module({
  imports: [MetamorphosisModule.register({logger : true})],
  ...
}
export class MyApp{
}
```

You use a custom logger, as following:
```
import { MetamorphosisNestModule } from '@fabio.formosa/metamorphosis-nest';

@Module({
  imports: [MetamorphosisModule.register({logger : myCustomerLogger.debug})],
  ...
}
export class MyApp{
}
```
where myCustomerLogger.debug must be a function `(msg: string) => void`

**FIXED** none

**BREAKING CHANGE** now import metamorphosisModule as following:
```
import { MetamorphosisNestModule } from '@fabio.formosa/metamorphosis-nest';

@Module({
  imports: [MetamorphosisModule.register()],
  ...
}
export class MyApp{
}
```

---

