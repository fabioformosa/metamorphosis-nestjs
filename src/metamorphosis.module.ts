import { Module } from '@nestjs/common';
import { ConversionService } from './metamorphosis.service';

@Module({
  providers: [ConversionService],
  exports: [ConversionService],
})
export class MetamorphosisModule {}
