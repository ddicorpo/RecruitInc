import * as mongoose from 'mongoose';
import { MongoConnectionFactory } from '../../src/data-source/db-registry/mongo/MongoConnectionFactory';
import { ObtainCandidatesCommand } from '../../src/domain/command/ObtainCandidatesCommand';
import { expect } from 'chai';

//tested the chardy database

xdescribe('Test pagination and filtering',() => {
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

      it('Test the function getCandidates page 3', async ()=> {
        const candidatesCommand: ObtainCandidatesCommand = new ObtainCandidatesCommand();
        let page: number = 3;
        let filter: string[] = [];
        let candidates = await candidatesCommand.getCandidates(page, filter);
        candidates = JSON.parse(candidates);
        expect('garthlezama').to.equal(candidates[0].platformUsername);
      });

      it('Test the function getCandidates (page 2 and filter:Java)', async ()=> {
        const candidatesCommand: ObtainCandidatesCommand = new ObtainCandidatesCommand();
        let page: number = 2;
        let filter: string[] = ['Java']
        let candidates = await candidatesCommand.getCandidates(page, filter);
        candidates = JSON.parse(candidates);
        expect('Dare_Pinkie').to.equal(candidates[0].platformUsername)
      });
});