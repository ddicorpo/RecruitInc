import { expect } from 'chai';
import { describe, it } from 'mocha';
import { stubObject } from 'ts-sinon'; // for stubbing
import { RequiredClientInformation } from '../../src/queue/RequiredClientInformation';
import { IGithubUser } from '../../src/data-extraction/github/api-entities/IGithubUser';
import { RepositoryClient } from "../../src/queue/clients/RepositoryClient";

let repoClient: RepositoryClient;

describe('Test the repositoryClient', () => {
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
            'montreal',
            'projectUrl'
        );
        repoClient = new RepositoryClient(requiredInfo);

    });

    it('Check to make sure that the repoClient constructor worked properly', () => {
        expect("bill nye").to.equal(repoClient.username);
        expect("testRepo").to.equal(repoClient.prospect.repoName);
    });


});
