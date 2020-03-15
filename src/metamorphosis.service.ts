import { Injectable } from '@nestjs/common';
import { ConversionHelper as MetamorphosisConversionService, logger, MetamorphosisPlugin} from '@fabio.formosa/metamorphosis';
import { getClass } from '@typegoose/typegoose/lib/internal/utils';
import * as mongoose from 'mongoose';


@Injectable()
export class ConversionService {

  private metamorphosisConversionService: MetamorphosisConversionService;

  constructor(logger: boolean | ((msg: string) => void) = false, plugins?: MetamorphosisPlugin[]){
    this.metamorphosisConversionService = new MetamorphosisConversionService({logger, plugins});
  }

  public async convert(sourceObj: any, targetClass:{ new(...args: any): any }): Promise<unknown> {
      logger.log(`CONVERSION SERVICE - Converting from ${sourceObj.constructor.name} to ${targetClass.name}`);
      return await this.metamorphosisConversionService.convert(sourceObj, targetClass);
  }

  public convertAll(sourceArray: any[], itemTargetClass:{ new(...args: any): any }): Promise<unknown[]> {
    return Promise.all(sourceArray.map(sourceObj => this.convert(sourceObj, itemTargetClass)));
  }

}
