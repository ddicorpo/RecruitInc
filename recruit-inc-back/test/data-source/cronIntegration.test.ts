import 'mocha';
import { CronTDG } from '../../src/data-source/table-data-gateway/cronTDG';
import { CronFinder } from '../../src/data-source/finder/CronFinder';
import { expect } from 'chai';
import * as mongoose from 'mongoose';
import { ICronModel, Status } from '../../src/domain/model/ICronModel';
import { MongoConnectionFactory } from '../../src/data-source/db-registry/mongo/MongoConnectionFactory';

require('dotenv').config(); //Get environment variables

describe.only('Test mongo cronObj', () => {
  const cron: ICronModel = {
    location: 'Montreal',
    number_scanned: 456,
    total_number: 75894,
    cron_pattern: 'pattern1',
    status: Status.scanning,
  };
  const cron2: ICronModel = {
    location: 'Quebec',
    number_scanned: 456,
    total_number: 754,
    cron_pattern: 'pattern1',
    status: Status.scanning,
  };
  const cron3: ICronModel = {
    location: 'Chicoutimi',
    number_scanned: 777,
    total_number: 1325,
    cron_pattern: 'pattern1',
    status: Status.scanning,
  };
  const cronTDG: CronTDG = new CronTDG();
  const cronFinder: CronFinder = new CronFinder();

  before(() => {
    // Establish connection
    let myFactory: MongoConnectionFactory = new MongoConnectionFactory();
    myFactory.defaultInitialization();
    // Start connection
    myFactory.getConnection();
  });

  after(() => {
    mongoose.connection.close();
    console.log(mongoose.connection.readyState);
  });

  it('Test mongo create cron object', async () => {
    let createdCronobj: ICronModel = await cronTDG.create(cron);
    expect(cron.location).to.equal(createdCronobj.location);
    //Insert other gitObj
    await cronTDG.create(cron2);
    await cronTDG.create(cron3);
  });

  it('Test mongo find by location and status', async () => {
    await cronFinder
      .findByLocationAndStatus(cron2.location, cron2.status)
      .then(doc => {
        let cronFound: ICronModel = doc;
        expect(cron2.location).to.equal( cronFound.location);
        expect(cron2.status).to.equal( cronFound.status);
      });
  });

  it('Test mongo findAll and then delete', async () => {
    let cronObjFound: ICronModel;
    //Find all gitObj
    await cronFinder.findAll().then(doc => {
      cronObjFound = doc;
    });
    //Delete the gitDatas that were found
    for (let i: number = 0; i < 3; i++) {
      let deleteSuccess: boolean = await cronTDG.delete(cronObjFound[i]._id);
      expect(deleteSuccess).to.be.equal(true);
    }
  });
});
