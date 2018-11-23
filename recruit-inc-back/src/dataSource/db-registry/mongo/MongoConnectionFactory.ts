import { MongoConnection } from './MongoConnection';
import * as mongoose from 'mongoose';
import { User } from '../../schema/User';
import { Schema } from 'inspector';

export class MongoConnectionFactory {
  public getConnection(): MongoConnection {
    //TODO: Return a Mongo Connection
    // mongodb+srv://admin:<PASSWORD>@cluster0-urrz3.mongodb.net/test?retryWrites=true
    return new MongoConnection();
  }

  public defaultInitialization(): void {
    // const mongoConnection: MongoConnection = new MongoConnection();
    const urlOnly =
      'mongodb://bob:admin@cluster0-shard-00-00-celgm.mongodb.net:27017,cluster0-shard-00-01-celgm.mongodb.net:27017,cluster0-shard-00-02-celgm.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true';
    const options = {
      reconnectTries: Number.MAX_VALUE,
      poolSize: 10,
    };
    try {
      mongoose
        .connect(
          urlOnly,
          options
        )
        .then(
          () => {
            console.log('Database connection established!');
            mongoose.close();
          },
          err => {
            console.log('Error connecting Database instance due to: ', err);
            mongoose.close();
          }
        );
    } catch (e) {
      mongoose.close();
    }
  }
}
