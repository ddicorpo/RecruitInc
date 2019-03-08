import 'mocha';
import { IncreaseScanUserCommand } from '../../../src/domain/command/IncreaseScanUserCommand';
import { expect } from 'chai';
import { MongoConnectionFactory } from '../../../src/data-source/db-registry/mongo/MongoConnectionFactory';
import * as mongoose from 'mongoose';
require('dotenv').config(); //Get environment variables

xdescribe('Test Increase Scanning by one Command', () => {

    before(() => {
        // Establish connection
        let myFactory: MongoConnectionFactory = new MongoConnectionFactory();
        myFactory.defaultInitialization();
        // Start connection
        myFactory.getConnection();
    });
    it('Test increase scanning', async () => {

        const town: string = 'port-of-spain';
        const command: IncreaseScanUserCommand = new IncreaseScanUserCommand();
        await command.increasedByOne(town).then(
            result => {
                expect(result).to.equal(true);
            }
        )
    })

    after(() => {
        mongoose.connection.close();
    });
})