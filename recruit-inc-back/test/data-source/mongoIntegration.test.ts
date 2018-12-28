import 'mocha';
import { MongoConnectionFactory } from '../../src/data-source/db-registry/mongo/MongoConnectionFactory';

/**
 * This is an integration test for MongoConnectionFactory, it will be skipped by 'npm run test'
 * Demonstration of the custom connection factory
 */
xdescribe('Test mongo connection', () => {
  xit('Test mongo connection', () => {
    //The factory allowing to manually set the constant without .env enabled
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

    myFactory.getConnection();
  });
});
