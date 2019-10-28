import { ObjectID } from "bson";
import { prop } from '@typegoose/typegoose';

export default class Team{
    _id: ObjectID;
    
    @prop({require : true})
    name: string;
    
    @prop({require : true})
    city: string;
  }