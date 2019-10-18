import { Injectable } from '@nestjs/common';
import { ConversionService } from '@fabio.formosa/metamorphosis';
import { getClassForDocument } from '@typegoose/typegoose';
import { Model } from 'mongoose';


@Injectable()
export class MetamorphosisNestService {

  private conversionService: ConversionService = new ConversionService();

  public convert(sourceObj: any, targetClass:{ new(...args: any): any }):any{
    if(sourceObj instanceof Model){
      const actualSourceType = getClassForDocument(sourceObj) || sourceObj.constructor;
      return this.conversionService.convertBySource(sourceObj, actualSourceType, targetClass);
    }
    else
      return this.conversionService.convert(sourceObj, targetClass);
  }

}
