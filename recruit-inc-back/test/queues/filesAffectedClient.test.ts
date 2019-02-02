import { expect } from 'chai';
import { describe, it } from 'mocha';
import { stubObject } from 'ts-sinon'; // for stubbing
import { RequiredClientInformation } from '../../src/queue/RequiredClientInformation';
import { IGithubUser } from '../../src/data-extraction/github/api-entities/IGithubUser';
import { FilesAffectedByClient } from "../../src/queue/clients/FilesAffectedByClient";

let filesClient: FilesAffectedByClient;

describe('Test the FilesAffectedByClient', () => {
    before(() => {
        const newUser: IGithubUser = {
            login: 'bill nye',
            createdAt: '',
            url: '',
            email: '',
        };
        let requiredInfo: RequiredClientInformation = new RequiredClientInformation(
            newUser,
            'testRepo',
            'bob',
            'path',
            '122',
            'montreal'
        );
        filesClient = new FilesAffectedByClient(requiredInfo);

    });

    it('Check to make sure that the filesAffectedByClient constructor worked properly', () => {
        expect("bob").to.equal(filesClient.owner);
        expect("testRepo").to.equal(filesClient.repository);
        expect("122").to.equal(filesClient.commitId)

    });


});