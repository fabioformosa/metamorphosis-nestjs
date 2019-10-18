import { Injectable } from '@nestjs/common';
import { ConversionService as MetamorphosisConversionService} from '@fabio.formosa/metamorphosis';
import { getClassForDocument } from '@typegoose/typegoose';
import { Model } from 'mongoose';


@Injectable()
export class ConversionService {

  private metamorphosisConversionService: MetamorphosisConversionService = new MetamorphosisConversionService();

  public convert(sourceObj: any, targetClass:{ new(...args: any): any }):any{
    if(sourceObj instanceof Model){
      const actualSourceType = getClassForDocument(sourceObj) || sourceObj.constructor;
      return this.metamorphosisConversionService.convertBySource(sourceObj, actualSourceType, targetClass);
    }
    else
      return this.metamorphosisConversionService.convert(sourceObj, targetClass);
  }

}
