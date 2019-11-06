import { Convert, Converter } from "@fabio.formosa/metamorphosis";
import Car from "../models/car";
import CarDto from "../dtos/car.dto";

@Convert(Car, CarDto)
export default class CarToCarDtoConverter implements Converter<Car, CarDto> {
  
  public convert(source: Car): CarDto {
    const target = new CarDto();
    target.color = source.color;
    target.model = source.model;
    target.manufacturerName = source.manufacturer.name;
    return target;
  }

}