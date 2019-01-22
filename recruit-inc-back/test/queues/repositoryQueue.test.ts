import { expect } from 'chai';
import { describe, it } from 'mocha';
import { stubObject } from 'ts-sinon';
import { RepositoryQueue } from '../../src/queue/queues/RepositoryQueue';
import { RequiredClientInformation } from '../../src/queue/RequiredClientInformation';
import { IGithubUser } from '../../src/data-extraction/github/api-entities/IGithubUser';

const repoQueue: RepositoryQueue = RepositoryQueue.get_instance();

describe.only('Get User information', () => {
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
    repoQueue.enqueue(requiredInfo);
    repoQueue.enqueue(requiredInfo2);
  });

  it('Check to make sure enqueue worked, and size method works', () => {
    let size = repoQueue.size();
    expect(2).to.equal(size);
  });

  it('Check to make sure is empty method works', () => {
    let notEmpty = repoQueue.isEmpty();
    expect(false).to.equal(notEmpty);
  });

  it('Check to make sure dequeue works properly, needed to remove from global as well', () => {
    let repoClient = repoQueue.dequeue();
    expect('testRepo').to.equal(repoClient.prospect.repoName);
    let size = repoQueue.size();
    expect(1).to.equal(size);
    let repoClient2 = repoQueue.dequeue();
    expect('testingStuff').to.equal(repoClient2.prospect.repoName);
    let notEmpty = repoQueue.isEmpty();
    expect(true).to.equal(notEmpty);
  });
});
