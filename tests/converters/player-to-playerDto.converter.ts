import { Convert, Converter } from "@fabio.formosa/metamorphosis";
import Player from "../models/player";
import PlayerDto from "../dtos/player.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
@Convert(Player, PlayerDto)
export default class PlayerConverterTest implements Converter<Player, PlayerDto> {
  
  constructor(){
    console.log('Creating converter from Player to PlayerDto');
  }

  public convert(source: Player): PlayerDto {
    const target = new PlayerDto();
    target.id = source._id.toString();
    target.name = source.name;
    target.team = source.team.name;
    return target;
  }

}