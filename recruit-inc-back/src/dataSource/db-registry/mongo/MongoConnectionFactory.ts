import { MongoConnection } from './MongoConnection';
import * as mongoose from 'mongoose';
import { User } from '../../schema/User';

export class MongoConnectionFactory {
  public getConnection(): MongoConnection {
    //TODO: Return a Mongo Connection
    // mongodb+srv://admin:<PASSWORD>@cluster0-urrz3.mongodb.net/test?retryWrites=true
    return new MongoConnection();
  }

  public defaultInitialization(): void {
    try {
      const mongoConnection: MongoConnection = new MongoConnection();

      let tempConnection =
        'mongodb+srv://admin:admin@cluster0.mongodb.net/RecruitIncDB';

      mongoose.connect(tempConnection);

      const UserModel = new User().getModelForClass(User);

      // UserModel is a regular Mongoose Model with correct types
      (async () => {
        const u = new UserModel({ username: 'JohnDoe' });
        await u.save();
        const user = await UserModel.findOne();
        // prints { _id: 59218f686409d670a97e53e0, name: 'JohnDoe', __v: 0 }
        console.log(user);
      })();
    } catch (e) {
      console.log('This is mongo connection error: ' + e);
    }
  }
}
