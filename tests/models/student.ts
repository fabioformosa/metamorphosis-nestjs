import * as mongoose from 'mongoose';
import { prop, modelOptions } from '@typegoose/typegoose';
import { ObjectID } from 'bson';

@modelOptions({
    existingMongoose: mongoose,
    schemaOptions: { collection: 'students' },
  })
export default class Student{

    _id: ObjectID;

    @prop({require : true})
    name: string
    
    @prop({require : true})
    lastname: string;

}