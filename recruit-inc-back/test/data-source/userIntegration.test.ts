import 'mocha';
import { MongoConnectionFactory } from '../../src/data-source/db-registry/mongo/MongoConnectionFactory';
import { UserTDG } from '../../src/data-source/table-data-gateway/userTDG';
import { UserModel } from '../../src/domain/model/userModel';
/**
 * This is an integration test user
 */
describe('Test mongo User', () => {
  it('Test mongo create user', () => {
    // GIVEN , Open a connection
    const dbOption =
      '-shard-00-00-celgm.mongodb.net:27017,cluster0-shard-00-01-celgm.mongodb.net:27017,' +
      "'cluster0-shard-00-02-celgm.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true ";
    let myFactory: MongoConnectionFactory = new MongoConnectionFactory(
      'mongodb://',
      'admin',
      null,
      'bob',
      'cluster0',
      dbOption,
      true
    );
    //When
    // Start connection
    myFactory.getConnection();
    const newUser: UserModel = {
      username: 'Gilbert49',
      firstName: 'Gil',
      lastName: 'Foobar',
      hashedPassword: 'blablabla',
      email: 'megaGil@gmail.com',
    };
    const userTDG: UserTDG = new UserTDG();

    //Then
    async () => {
      try {
        await userTDG.create(newUser);
      } catch (Exception) {
        console.log(Exception);
      }
    };
  });
});
