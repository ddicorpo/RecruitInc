import { expect } from 'chai';
import { describe, it } from 'mocha';
import { stubObject } from 'ts-sinon';
import { RepositoryQueue } from "../../src/queue/queues/RepositoryQueue";
import { RequiredClientInformation } from "../../src/queue/RequiredClientInformation";
import { IGithubUser } from "../../src/data-extraction/github/api-entities/IGithubUser";


const repoQueue: RepositoryQueue = RepositoryQueue.get_instance();


xdescribe('Get User information', () => {
    before(() => {
        const newUser: IGithubUser = {
            login: "bill nye",
            createdAt: '',
            url: '',
            email: '',
        };
        let requiredInfo: RequiredClientInformation = new RequiredClientInformation(
            newUser,
            "testRepo",
            "bob",
            "path",
            "122",
            "montreal");
        repoQueue.enqueue(requiredInfo);
    });

    it('Check to make sure enqueue worked, and size method works', () => {
        let size = repoQueue.size();
        expect(1).to.equal(size);
    });

    it('Check to make sure is empty method works', () => {
        let notEmpty = repoQueue.isEmpty();
        expect(false).to.equal(notEmpty);
    });

    it('Check to make sure dequeue works properly, needed to remove from global as well', () => {
        let repoClient = repoQueue.dequeue();
        expect("testRepo").to.equal(repoClient.prospect.repoName);
        let size = repoQueue.size();
        expect(0).to.equal(size);
        let notEmpty = repoQueue.isEmpty();
        expect(true).to.equal(notEmpty);
    });

});






