import { Injectable } from '@nestjs/common';
import ConversionService from '@fabio.formosa/metamorphosis/dist/src/service/conversion-service';


@Injectable()
export class MetamorphosisNestService {

  private conversionService: ConversionService = new ConversionService();

  public convert(sourceObj: any, targetClass:{ new(...args: any): any }):any{
    return this.conversionService.convert(sourceObj, targetClass);
  }

}
