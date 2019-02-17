import { expect } from 'chai';
import { describe, it } from 'mocha';
import { stubObject } from 'ts-sinon'; // for stubbing
import { RequiredClientInformation } from '../../src/queue/RequiredClientInformation';
import { IGithubUser } from '../../src/data-extraction/github/api-entities/IGithubUser';
import { CommitClient } from "../../src/queue/clients/CommitClient";

let commitClient: CommitClient;

describe('Test the commitClient', () => {
    before(() => {
        const newUser: IGithubUser = {
            login: 'bill nye',
            id: 'id',
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
            'montreal',
            'projectUrl'
        );
        commitClient = new CommitClient(requiredInfo);

    });

    it('Check to make sure that the commitClient constructor worked properly', () => {
        expect("bob").to.equal(commitClient.owner);
        expect("testRepo").to.equal(commitClient.prospect.repoName);
        expect("testRepo").to.equal(commitClient.repository);
        expect("id").to.equal(commitClient.userId);
    });

});
