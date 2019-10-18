import { Module } from '@nestjs/common';
import { ConversionService } from './metamorphosis-nest.service';

@Module({
  providers: [ConversionService],
  exports: [ConversionService],
})
export class MetamorphosisModule {}
