import { Converter, Convert } from "@fabio.formosa/metamorphosis";
import PlanetDto from "../dtos/planet.dto";
import Planet from "../models/planet";
import { Injectable } from "@nestjs/common";

@Injectable()
@Convert(PlanetDto, Planet)
export default class PlanetDtoToPlanet implements Converter<PlanetDto, Promise<Planet>> {
  
  async convert(source: PlanetDto): Promise<Planet> {
    const target = await this._simulateDBRetrieve(source.id);
    target.name = source.name;
    return target;
  }
  
  async _simulateDBRetrieve(id: string) {
    const planet = new Planet();
    planet.id = id;
    return planet;
  }

}