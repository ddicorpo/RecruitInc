import 'mocha';
import { TokenTDG } from '../../src/data-source/table-data-gateway/tokenTDG';
import { ITokenModel } from '../../src/domain/model/ITokenModel';
import { Platform } from '../../src/domain/model/IGitDataModel';
import { TokenFinder } from '../../src/data-source/finder/tokenFinder';
import { expect } from 'chai';
import * as mongoose from 'mongoose';
require('dotenv').config(); //Get environment variables

xdescribe('Test mongo token', () => {
  const newToken: ITokenModel = {
    platform: Platform.Github,
    AccessToken: 'pJMTAC9SK1',
    RefreshToken: 'pO0Spkhljq',
    ExpiryDate: new Date(2018, 9, 23).toString(),
  };
  const newToken2: ITokenModel = {
    platform: Platform.Gitlab,
    AccessToken: '4c8wiwSEeI',
    RefreshToken: 'yOf2gUfQnl',
    ExpiryDate: new Date(2018, 10, 24).toString(),
  };
  const newToken3: ITokenModel = {
    platform: Platform.Bitbucket,
    AccessToken: 'RIluOBWIIt',
    RefreshToken: 't6nsCdaVMa',
    ExpiryDate: new Date(2018, 11, 25).toString(),
  };
  const tokenTDG: TokenTDG = new TokenTDG();
  const tokenFinder: TokenFinder = new TokenFinder();

  before(function(done) {
    mongoose.connect(
      `${process.env.DB_HOST}/${process.env.DB_NAME}`,
      { useNewUrlParser: true }
    ); //Connect to database
    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error'));

    db.once('open', function() {
      console.log('We are connected to the database');
      done();
    });
  });

  after(() => {
    mongoose.connection.close();
    console.log(mongoose.connection.readyState);
  });

  it('Test mongo create token', async () => {
    let createdToken: ITokenModel = await tokenTDG.create(newToken);
    expect(newToken.platform).to.equal(createdToken.platform);
    //Insert other gitObj
    await tokenTDG.create(newToken2);
    await tokenTDG.create(newToken3);
  });

  it('Test mongo Find By Exirpy Date', async () => {
    await tokenFinder.findByExpiryDate(newToken.ExpiryDate).then(doc => {
      let TokenFound: ITokenModel = doc;
      console.log(TokenFound);
      expect(newToken.ExpiryDate).to.equal(TokenFound.ExpiryDate);
      expect(newToken.platform).to.equal(TokenFound.platform);
    });
  });

  it('Test mongo findAll and then delete', async () => {
    let TokenFound: ITokenModel;
    //Find all gitObj
    await tokenFinder.findAll().then(doc => {
      TokenFound = doc;
    });
    //Delete the gitDatas that were found
    for (let i: number = 0; i < 3; i++) {
      let deleteSuccess: boolean = await tokenTDG.delete(TokenFound[i]._id);
      expect(deleteSuccess).to.be.equal(true);
    }
  });
});
