import { Module, DynamicModule } from '@nestjs/common';
import { ConversionService } from './metamorphosis.service';

// @Module({
//   providers: [ConversionService],
//   exports: [ConversionService],
// })
// export class MetamorphosisModule {}

const ConversionServiceFactory = (logger: boolean = false) => ({
  provide: 'ConversionService',
  useFactory: () =>  new ConversionService(logger)
});

@Module({})
export class MetamorphosisModule {
  static register({logger}: {logger: boolean} = {logger: false}): DynamicModule {
    return {
      module: MetamorphosisModule,
      providers: [ConversionServiceFactory(logger)],
      exports: [ConversionService],
    };
  }
}
