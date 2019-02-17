import 'mocha';
import { MongoConnectionFactory } from '../../src/data-source/db-registry/mongo/MongoConnectionFactory';

/**
 * This is an integration test for MongoConnectionFactory, it will be skipped by 'npm run test'
 * Demonstration of the custom connection factory
 */
xdescribe('Test mongo connection', () => {
  xit('Test mongo connection', () => {
    //The factory allowing to manually set the constant without .env enabled
    let myFactory: MongoConnectionFactory = new MongoConnectionFactory(
      'mongodb://169.45.50.135',
      null,
      '14002',
      null,
      'fakeDb',
      null,
      true
    );

    myFactory.getConnection();
  });
});
