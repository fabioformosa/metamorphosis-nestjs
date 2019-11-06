import { Module, DynamicModule } from '@nestjs/common';
import { ConversionService } from './metamorphosis.service';

const ConversionServiceFactory = (logger : boolean | ((msg: string) => void) = false) => ({
  provide: 'ConversionService',
  useFactory: () =>  new ConversionService(logger)
});

@Module({})
export class MetamorphosisModule {
  static register({logger}: {logger: boolean | ((msg: string) => void)} = {logger: false}): DynamicModule {
    return {
      module: MetamorphosisModule,
      providers: [ConversionServiceFactory(logger)],
      exports: [ConversionService],
    };
  }
}
