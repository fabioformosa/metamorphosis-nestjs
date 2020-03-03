[![Build Status](https://travis-ci.org/fabioformosa/metamorphosis-nestjs.svg?branch=master)](https://travis-ci.org/fabioformosa/metamorphosis-nestjs)
[![Coverage Status](https://coveralls.io/repos/github/fabioformosa/metamorphosis-nestjs/badge.svg?branch=master)](https://coveralls.io/github/fabioformosa/metamorphosis-nestjs?branch=master)

# METAMORPHOSIS-NESTJS

> "Nothing is lost, nothing is created, everything is transformed"
> _Lavoisier

**Metamorphosis** is set of libraries that provide utilities to convert objects from a class to another one. Tipically you'll have to convert entities to DTOs and/or viceversa.

**Metamorphosis-nest** is the NodeJs version of Metamorphosis library, and it has been adapted to the popular framework [NestJS](https://nestjs.com). This module exports a conversion service, that you can import and use into your application as hub of all convertions.

![Red Chameleon - ph. George Lebada - pexels.com!](https://images.pexels.com/photos/567540/pexels-photo-567540.jpeg?auto=compress&cs=tinysrgb&h=325&w=470 "Red Chameleon - ph. George Lebada - pexels.com")


## QUICK START

### INSTALL
`npm install --save @fabio.formosa/metamorphosis-nest`

### IMPORT MODULE

```
import { MetamorphosisNestModule } from '@fabio.formosa/metamorphosis-nest';

@Module({
  imports: [MetamorphosisModule.register()],
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

  public async getCar(id: string): CarDto{
      const car: Car = await CarModel.findById(id);
      return <CarDto> await this.convertionService.convert(car, CarDto);
  }

}
```

## ADVANCED FEATURES

### CONVERT ARRAYS

```
const cars: Car[] = ...
const carDtos = <CarDto[]>  await this.convertionService.convertAll(cars, CarDto);
```

### ASYNC CONVERSIONS

If your converter must be async (_eg. it must retrieve entities from DB_):

```
@Injectable()
@Convert(PlanetDto, Planet)
export default class PlanetDtoToPlanet implements Converter<PlanetDto, Promise<Planet>> {
  
  async convert(source: PlanetDto): Promise<Planet> {
   ...
  }

}
```
 * Define Planet as target type in `@Convert` 
 * declare `Promise<Planet>` in `Converter interface`. 
 * The convert method will be `async`.

When you invoke conversionService you must apply `await` if you know for that conversion is returned a `Promise`.

```
const planet = <Planet> await conversionService.convert(planetDto, Planet);
```

or in case of conversion of an array:
```
const planets = <Planet[]> await Promise.all(conversionService.convert(planetDto, Planet));
```


### TYPEGOOSE SUPPORT
If you have to convert mongoose document into DTO, it's recommended to use [Typegoose](https://https://github.com/typegoose/typegoose) and [class-transformer](https://github.com/typestack/class-transformer).

1. Add dependency:
    ```
    npm install --save @fabio.formosa/metamorphosis-typegoose-plugin
    ```

1. Register conversion service with `metamorphosis-typegoose-plugin`

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

1. Define the type of your model and the moongose schema using decorators (`@prop`). (note: team is annotate by `@Type` decorator provided by class-transformer in order to use `plainToClass` function)

  

    ```
    @modelOptions({
      existingMongoose: mongoose,
      collection: 'players'
    })
    class Player{
        _id: ObjectID;

        @prop({require : true})
        name: string;
        
        @prop()
        score: number;
        
        @Type(() => Team)
        @prop({require : true})
        team: Team;
    }

    class Team{
      _id: ObjectID;
      
      @prop({require : true})
      name: string;
      
      @prop({require : true})
      city: string;
    }

    ```
  1. Define your DTOs

      ```
        class PlayerDto{
          id: string;
          name: string;
          team: string;
        }

        class TeamDto{
          id: string;
          name: string;
          city: string;
        }
      ```

  1. Create converters
      ```
        import {Converter, Convert} from '@fabio.formosa/metamorphosis';

        @Convert(Player, PlayerDto)
        class PlayerConverterTest implements Converter<Player, PlayerDto> {
          
          public convert(source: Player): PlayerDto {
            const target = new PlayerDto();
            target.id = source._id.toString();
            target.name = source.name;
            target.team = source.team.name;
            return target;
          }

        }

        @Convert(Team, TeamDto)
        class TeamConverterTest implements Converter<Team, TeamDto> {
          
          public convert(source: Team): TeamDto {
            const target = new TeamDto();
            target.id = source._id.toString();
            target.name = source.name;
            target.city = source.city;
            return target;
          }

        }
      ```
  1. Use ConversionService
      ```
        import {ConversionService} from '@fabio.formosa/metamorphosis-nest';

        @Injectable()
        class MyService{

          constructor(private readonly ConversionService conversionService){}
        
          doIt(){      
            const foundPlayerModel = await PlayerModel.findOne({'name': 'Baggio'}).exec() || player;

            const playerDto = <PlayerDto> await this.conversionService.convert(foundPlayerModel, PlayerDto);

            //if you want convert only the team (and not also the Player)
            const teamDto = <TeamDto> await conversionService.convert(foundPlayer.team, TeamDto);
          }
      ```

### DEBUG MODE

To activate debug mode

```
import { MetamorphosisNestModule } from '@fabio.formosa/metamorphosis-nest';

@Module({
  imports: [MetamorphosisModule.register({logger: true})],
  ...
}
export class MyApp{
}
```
In this case, metamorphosis will send log to console. Otherwise, you can pass a custom debug function `(msg: string) => void` , e.g:
```
import { MetamorphosisNestModule } from '@fabio.formosa/metamorphosis-nest';

const myCustomLogger = {
  debug: (msg: string) => {
    winston.logger(msg); //example
  }
}

@Module({
  imports: [MetamorphosisModule.register({logger: myCustomLogger.debug})],
  ...
}
export class MyApp{
}
```

At the moment, MetamorphosisNestModule uses console to log.
Soon, it will be possible to pass a custom logger.

## REQUIREMENTS
* TypeScript 3.2+
* Node 8, 10+
* emitDecoratorMetadata and experimentalDecorators must be enabled in tsconfig.json

## CREDITS
Red Chameleon in this README file is a picture of ph. George Lebada (pexels.com)
