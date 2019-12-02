import { Injectable } from '@nestjs/common';
import { ConversionHelper as MetamorphosisConversionService, logger} from '@fabio.formosa/metamorphosis';
import { getClass } from '@typegoose/typegoose/lib/internal/utils';
import * as mongoose from 'mongoose';


@Injectable()
export class ConversionService {

  private metamorphosisConversionService: MetamorphosisConversionService;

  constructor(logger: boolean | ((msg: string) => void) = false){
    this.metamorphosisConversionService = new MetamorphosisConversionService({logger});
  }

  public convert(sourceObj: any, targetClass:{ new(...args: any): any }): any {
    if(sourceObj instanceof mongoose.Model || sourceObj instanceof mongoose.Schema.Types.Embedded || (sourceObj.constructor && sourceObj.constructor.name == 'SingleNested')){
      logger.log(`CONVERSION SERVICE - Typegoose support - detected sourceObj ${sourceObj.construct} converting to ${targetClass}`);
      const actualSourceType = getClass(sourceObj) || sourceObj.constructor;
      logger.log(`CONVERSION SERVICE - Converting from actualSourceType ${actualSourceType.name} to ${targetClass.name}`);
      return this.metamorphosisConversionService.convertBySource(sourceObj, actualSourceType, targetClass);
    }
    else{
      logger.log(`CONVERSION SERVICE - Converting from ${sourceObj.constructor.name} to ${targetClass.name}`);
      return this.metamorphosisConversionService.convert(sourceObj, targetClass);
    }
  }

  public convertAll(sourceArray: any[], itemTargetClass:{ new(...args: any): any }): any[] {
    return sourceArray.map(sourceObj => this.convert(sourceObj, itemTargetClass));
  }

}
