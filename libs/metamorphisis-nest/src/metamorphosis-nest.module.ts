import { Module } from '@nestjs/common';
import { MetamorphosisNestService as MetamorphosisNestService } from './metamorphosis-nest.service';

@Module({
  providers: [MetamorphosisNestService],
  exports: [MetamorphosisNestService],
})
export class MetamorphosisNestModule {}
