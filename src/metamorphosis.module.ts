import { Module, DynamicModule } from '@nestjs/common';
import { ConversionService } from './metamorphosis.service';
import { MetamorphosisPlugin } from '@fabio.formosa/metamorphosis';

const ConversionServiceFactory = (logger : boolean | ((msg: string) => void) = false, plugins?: MetamorphosisPlugin[]) => ({
  provide: 'ConversionService',
  useFactory: () =>  new ConversionService(logger, plugins)
});

@Module({})
export class MetamorphosisModule {
  static register({logger, plugins}: {logger: boolean | ((msg: string) => void), plugins?: MetamorphosisPlugin[]} = {logger: false, plugins: []}): DynamicModule {
    return {
      module: MetamorphosisModule,
      providers: [ConversionServiceFactory(logger, plugins)],
      exports: [ConversionService],
    };
  }
}
