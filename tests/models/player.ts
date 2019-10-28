import * as mongoose from 'mongoose';
import { prop, modelOptions } from '@typegoose/typegoose';
import { ObjectID } from 'bson';
import { Type } from 'class-transformer';
import Team from './team';

@modelOptions({
    existingMongoose: mongoose,
    schemaOptions: { collection: 'players' },
  })
export default class Player{

    _id: ObjectID;

    @prop({require : true})
    name: string;
    
    @prop()
    score: number;
    
    @Type(() => Team)
    @prop({require : true})
    team: Team;
  }