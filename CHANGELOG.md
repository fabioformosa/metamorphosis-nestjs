## **v2.0.1**  [UNRELEASED]

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

