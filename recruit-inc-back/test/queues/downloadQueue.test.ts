import { expect } from 'chai';
import { describe, it } from 'mocha';
import { stubObject } from 'ts-sinon'; // for stubbing
import { RequiredClientInformation } from '../../src/queue/RequiredClientInformation';
import { IGithubUser } from '../../src/data-extraction/github/api-entities/IGithubUser';
import { DownloadQueue } from "../../src/queue/queues/DownloadQueue";

const downloadQueue: DownloadQueue = DownloadQueue.get_instance();

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
        downloadQueue.enqueue(requiredInfo);
        downloadQueue.enqueue(requiredInfo2);
    });

    it('Check to make sure enqueue worked, and size method works', () => {
        let size = downloadQueue.size();
        expect(2).to.equal(size);
    });

    it('Check to make sure is empty method works', () => {
        let notEmpty = downloadQueue.isEmpty();
        expect(false).to.equal(notEmpty);
    });

    it('Check to make sure dequeue works properly, needed to remove from global as well', () => {
        let downloadClient = downloadQueue.dequeue();
        expect('testRepo').to.equal(downloadClient.repository);
        let size = downloadQueue.size();
        expect(1).to.equal(size);
        let downloadClient2 = downloadQueue.dequeue();
        expect('testingStuff').to.equal(downloadClient2.repository);
        let notEmpty = downloadQueue.isEmpty();
        expect(true).to.equal(notEmpty);
    });
});