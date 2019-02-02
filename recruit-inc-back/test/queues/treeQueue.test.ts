import { expect } from 'chai';
import { describe, it } from 'mocha';
import { stubObject } from 'ts-sinon'; // for stubbing
import { RequiredClientInformation } from '../../src/queue/RequiredClientInformation';
import { IGithubUser } from '../../src/data-extraction/github/api-entities/IGithubUser';
import { TreeQueue } from "../../src/queue/queues/TreeQueue";

const treeQueue: TreeQueue = TreeQueue.get_instance();

describe('Get User information', () => {
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
        let requiredInfo2: RequiredClientInformation = new RequiredClientInformation(
            newUser,
            'testingStuff',
            'bob',
            'path',
            '122',
            'montreal'
        );
        treeQueue.enqueue(requiredInfo);
        treeQueue.enqueue(requiredInfo2);
    });

    it('Check to make sure enqueue worked, and size method works', () => {
        let size = treeQueue.size();
        expect(2).to.equal(size);
    });

    it('Check to make sure is empty method works', () => {
        let notEmpty = treeQueue.isEmpty();
        expect(false).to.equal(notEmpty);
    });

    it('Check to make sure dequeue works properly, needed to remove from global as well', () => {
        let treeClient = treeQueue.dequeue();
        expect('testRepo').to.equal(treeClient.prospect.repoName);
        let size = treeQueue.size();
        expect(1).to.equal(size);
        let treeClient2 = treeQueue.dequeue();
        expect('testingStuff').to.equal(treeClient2.prospect.repoName);
        let notEmpty = treeQueue.isEmpty();
        expect(true).to.equal(notEmpty);
    });
});