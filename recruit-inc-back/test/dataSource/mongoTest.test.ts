import { expect } from 'chai';
import 'mocha';
import { MongoConnectionFactory } from '../../src/dataSource/db-registry/mongo/MongoConnectionFactory';
import { MongoConnection } from '../../src/dataSource/db-registry/mongo/MongoConnection';

describe('Test mongo connection', () => {
  it('Test mongo connection', () => {
    // GIVEN

    let myFactory: MongoConnectionFactory = new MongoConnectionFactory();
    myFactory.defaultInitialization();

    // WHEN

    // THEN
  });
});
