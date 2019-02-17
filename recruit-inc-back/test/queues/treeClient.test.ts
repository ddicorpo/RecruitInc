import { expect } from 'chai';
import { describe, it } from 'mocha';
import { stubObject } from 'ts-sinon'; // for stubbing
import { RequiredClientInformation } from '../../src/queue/RequiredClientInformation';
import { IGithubUser } from '../../src/data-extraction/github/api-entities/IGithubUser';
import { TreeClient } from "../../src/queue/clients/TreeClient";

let treeClient: TreeClient;

describe('Test the treeClient', () => {
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
        treeClient = new TreeClient(requiredInfo);

    });

    it('Check to make sure that the treeClient constructor worked properly', () => {
        expect("bob").to.equal(treeClient.owner);
        expect("testRepo").to.equal(treeClient.prospect.repoName);
        expect("testRepo").to.equal(treeClient.repository);
    });


});
