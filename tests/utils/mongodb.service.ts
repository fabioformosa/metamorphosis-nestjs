import { MongoMemoryServer } from 'mongodb-memory-server';
import { ConnectionOptions } from 'mongoose';
import * as mongoose from 'mongoose';

const mongoDBHelper = {
    connect : async (): Promise<void> => {
        console.log(`MongoDB SERVICE - Connecting to mongodb in memory...`);
        const dataSource = await getDataSource();
        console.log(`MongoDB SERVICE - Connecting to datasource ${dataSource}`);
        mongoose.set('useUnifiedTopology', true);
        const options: ConnectionOptions = {
          useNewUrlParser: true,
          connectTimeoutMS: 10000,
          useFindAndModify: false,
        };
        try {
          await mongoose.connect(dataSource, options);
          console.log(`MongoDB SERVICE - Connected to datasource ${dataSource}`);
        } catch (e) {
          console.log(`MongoDB SERVICE - Unexpected error connecting to datasource ${dataSource} due to ${e}`);
          throw e;
        }
      },

      disconnect: async (): Promise<void> => {
        await mongoose.disconnect();
      }
}

const  getDataSource = async (): Promise<string> => {
    console.log(`MongoDB SERVICE - creating MongoMemoryServer...`);
    const mongoMemoryServer = new MongoMemoryServer({ debug: false });
    console.log(`MongoDB SERVICE - created MongoMemoryServer`);
    return await mongoMemoryServer.getConnectionString();
  };

export {mongoDBHelper as MongoDBHelper}