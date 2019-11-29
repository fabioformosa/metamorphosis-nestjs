import * as mongoose from 'mongoose';
import { prop, modelOptions, Ref, arrayProp } from '@typegoose/typegoose';
import { ObjectID } from 'bson';
import Student from './student';

@modelOptions({
    existingMongoose: mongoose,
    schemaOptions: { collection: 'courses' },
  })
export default class Course{

    _id: ObjectID;

    @prop({require : true})
    name: string;

    @arrayProp({ required: false, itemsRef: 'Student' })
    students: Ref<Student>[];

}