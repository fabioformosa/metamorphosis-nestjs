import { getClassForDocument, getModelForClass } from '@typegoose/typegoose';

import { TestingModule, Test } from '@nestjs/testing';
import { MetamorphosisModule } from '../src/metamorphosis.module';
import { ConversionService } from '../src/metamorphosis.service';
import { MongoDBHelper } from './utils/mongodb.service';
import Player from './models/player';
import PlayerDto from './dtos/player.dto';
import TeamDto from './dtos/team.dto';
import PlayerConverterTest from './converters/player-to-playerDto.converter';
import TeamConverterTest from './converters/team-to-teamDto.converter';
import Course from './models/course';
import Student from './models/student';
import CourseDTO from './dtos/course.dto';
import CourseConverterTest from './converters/course-to-couseDto.converter';
import TypegoosePlugin from '@fabio.formosa/metamorphosis-typegoose-plugin/dist/typegoose-plugin';
import { MetamorphosisPlugin } from '@fabio.formosa/metamorphosis';


let conversionService: ConversionService;
const typegoosePlugin: MetamorphosisPlugin = new TypegoosePlugin();

describe('Conversion with typegoose', () => {

  beforeAll(async () => {
    await MongoDBHelper.connect();
  });
  
  afterAll(async () => {
    await MongoDBHelper.disconnect();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MetamorphosisModule.register({logger: true, plugins: [typegoosePlugin]})],
      providers: [PlayerConverterTest, TeamConverterTest, CourseConverterTest]
    }).compile();

    conversionService = module.get<ConversionService>(ConversionService);
  });

  
  it('should convert a typegoose model into a dto', async () => {
      const PlayerModel = getModelForClass(Player);

      const player = await PlayerModel.create({
        name : 'Baggio', 
        score: 100,
        team: { name: 'Inter', city: 'Milan'}
      });
      player.save();

      const foundPlayerModel = await PlayerModel.findOne({'name': 'Baggio'}).exec() || player;
      expect(foundPlayerModel).toBeDefined();
      expect(foundPlayerModel.team).toBeDefined();

      const playerDto = <PlayerDto> await conversionService.convert(foundPlayerModel, PlayerDto);
      expect(playerDto).toBeDefined();
      expect(playerDto).toHaveProperty('id');
      expect(playerDto.name).toBe('Baggio');

      const foundPlayer = foundPlayerModel;

      const teamDto = <TeamDto> await conversionService.convert(foundPlayer.team, TeamDto);
      expect(teamDto).toBeDefined();
      expect(teamDto).toHaveProperty('id');
      expect(teamDto.name).toBe('Inter');
      expect(teamDto.city).toBe('Milan');

    });

    it('should convert a typegoose model with reference', async () => {
      const StudentModel = getModelForClass(Student);
      
      const fibonacci = await StudentModel.create({
        name: 'Leonardo',
        lastname: 'Fibonacci'
      });
      fibonacci.save();
      const newton = await StudentModel.create({
        name: 'Isaac',
        lastname: 'Newton'
      });
      newton.save();

      const CourseModel = getModelForClass(Course);
      const mathCourse = await CourseModel.create({
        name: 'Mathematics',
        students: [fibonacci, newton]
      });
      mathCourse.save();

      let foundCourse = await CourseModel.findOne({'name': 'Mathematics'}).populate({path: 'students', model: Student}).exec();
      if(foundCourse === null)
        throw new Error();
      expect(foundCourse).toBeDefined();
      expect(foundCourse).toHaveProperty('students');
      expect(foundCourse.students).toBeDefined();
      expect(foundCourse.students.length).toEqual(2);
      
      const courseDTO = <CourseDTO> await conversionService.convert(foundCourse, CourseDTO);
      expect(courseDTO).toHaveProperty('studentIds');
      expect(courseDTO.studentIds[0]).toEqual(fibonacci.id);
      expect(courseDTO.studentIds[1]).toEqual(newton.id);

    });

});