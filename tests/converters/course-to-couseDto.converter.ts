import { Convert, Converter } from "@fabio.formosa/metamorphosis";
import Course from "../models/course";
import CourseDTO from "../dtos/course.dto";
import Student from "../models/student";
import { Injectable } from "@nestjs/common";

@Injectable()
@Convert(Course, CourseDTO)
export default class CourseConverterTest implements Converter<Course, CourseDTO>{
    
    convert(source: Course): CourseDTO {
        const target = new CourseDTO();
        target.name = source.name;
        target.studentIds = source.students.map(s => (<Student>s)._id.toString());
        return target;
    }

}