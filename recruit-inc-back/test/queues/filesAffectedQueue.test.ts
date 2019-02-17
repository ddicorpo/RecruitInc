import { expect } from 'chai';
import { describe, it } from 'mocha';
import { stubObject } from 'ts-sinon'; // for stubbing
import { RequiredClientInformation } from '../../src/queue/RequiredClientInformation';
import { IGithubUser } from '../../src/data-extraction/github/api-entities/IGithubUser';
import { FilesAffectedByQueue } from "../../src/queue/queues/FilesAffectedByQueue";

const filesAffectedQueue: FilesAffectedByQueue = FilesAffectedByQueue.get_instance();

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
            'montreal',
            'projectUrl'
        );
        let requiredInfo2: RequiredClientInformation = new RequiredClientInformation(
            newUser,
            'testingStuff',
            'bob',
            'path',
            '122',
            'montreal',
            'projectUrl'
        );
        filesAffectedQueue.enqueue(requiredInfo);
        filesAffectedQueue.enqueue(requiredInfo2);
    });

    it('Check to make sure enqueue worked, and size method works', () => {
        let size = filesAffectedQueue.size();
        expect(2).to.equal(size);
    });

    it('Check to make sure is empty method works', () => {
        let notEmpty = filesAffectedQueue.isEmpty();
        expect(false).to.equal(notEmpty);
    });

    it('Check to make sure dequeue works properly, needed to remove from global as well', () => {
        let filesClient = filesAffectedQueue.dequeue();
        expect('testRepo').to.equal(filesClient.repository);
        let size = filesAffectedQueue.size();
        expect(1).to.equal(size);
        let filesClient2 = filesAffectedQueue.dequeue();
        expect('testingStuff').to.equal(filesClient2.repository);
        let notEmpty = filesAffectedQueue.isEmpty();
        expect(true).to.equal(notEmpty);
    });
});
