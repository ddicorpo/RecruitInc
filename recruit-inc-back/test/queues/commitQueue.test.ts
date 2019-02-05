import { expect } from 'chai';
import { describe, it } from 'mocha';
import { stubObject } from 'ts-sinon'; // for stubbing
import { RequiredClientInformation } from '../../src/queue/RequiredClientInformation';
import { IGithubUser } from '../../src/data-extraction/github/api-entities/IGithubUser';
import { CommitQueue } from "../../src/queue/queues/CommitQueue";

const commitQueue: CommitQueue = CommitQueue.get_instance();

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
        commitQueue.enqueue(requiredInfo);
        commitQueue.enqueue(requiredInfo2);
    });

    it('Check to make sure enqueue worked, and size method works', () => {
        let size = commitQueue.size();
        expect(2).to.equal(size);
    });

    it('Check to make sure is empty method works', () => {
        let notEmpty = commitQueue.isEmpty();
        expect(false).to.equal(notEmpty);
    });

    it('Check to make sure dequeue works properly, needed to remove from global as well', () => {
        let commitClient = commitQueue.dequeue();
        expect('testRepo').to.equal(commitClient.prospect.repoName);
        let size = commitQueue.size();
        expect(1).to.equal(size);
        let commitClient2 = commitQueue.dequeue();
        expect('testingStuff').to.equal(commitClient2.prospect.repoName);
        let notEmpty = commitQueue.isEmpty();
        expect(true).to.equal(notEmpty);
    });
});