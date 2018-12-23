import 'mocha';
import { MongoConnectionFactory } from '../../src/data-source/db-registry/mongo/MongoConnectionFactory';
import { expect } from 'chai';
import { Types } from 'mongoose';
import { IUserModel } from '../../src/domain/model/IUserModel';
import { HRTDG } from '../../src/data-source/table-data-gateway/hrTDG';
import { HRFinder } from '../../src/data-source/finder/hrFinder';
/**
 * This is a integration test for HR,
 * the HR data is a User saved in a special table
 */
xdescribe('Integration Test => HR ', () => {
  const newUser: IUserModel = {
    username: 'PaulPaul69',
    firstName: 'Paul',
    lastName: 'Loop',
    hashedPassword: 'eion20939230k2309k209ke2309e3902ke0k2e09k',
    email: 'superPaul@gmail.com',
  };

  const hrTDG: HRTDG = new HRTDG();
  const hrFinder: HRFinder = new HRFinder();

  beforeEach(() => {
    // Establish connection
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
    // Start connection
    myFactory.getConnection();
  });

  //To CONTINUE
});
