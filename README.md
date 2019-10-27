![](https://travis-ci.org/fabioformosa/metamorphosis-nest.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/fabioformosa/metamorphosis-nest/badge.svg?branch=master)](https://coveralls.io/github/fabioformosa/metamorphosis-nest?branch=master)

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
If you have to convert mongoose document into DTO, it's recommended to use [Typegoose](https://https://github.com/typegoose/typegoose) and [class-transformer](https://github.com/typestack/class-transformer).

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

          constructor(private readonly ConversionService conversionService)
        }
        
        const foundPlayerModel = await PlayerModel.findOne({'name': 'Baggio'}).exec() || player;

        const playerDto = this.conversionService.convert(foundPlayerModel, PlayerDto);

        //if you want convert only the team (and not also the Player)
        const foundPlayer = plainToClass(Player, foundPlayerModel.toObject());
        const teamDto = conversionService.convert(foundPlayer.team, TeamDto);
      ```

      For further details, see this [jest test](./test/metamorphosis-typegoose.spec.ts)

## REQUIREMENTS
* TypeScript 3.2+
* Node 8.10+
* emitDecoratorMetadata and experimentalDecorators must be enabled in tsconfig.json
