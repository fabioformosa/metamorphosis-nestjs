import { Convert, Converter } from "@fabio.formosa/metamorphosis";
import Team from "../models/team";
import TeamDto from "../dtos/team.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
@Convert(Team, TeamDto)
export default class TeamConverterTest implements Converter<Team, TeamDto> {

  constructor(){
    console.log('Creating converter from Team to TeamDto');
  }
  
  public convert(source: Team): TeamDto {
    const target = new TeamDto();
    target.id = source._id.toString();
    target.name = source.name;
    target.city = source.city;
    return target;
  }

}