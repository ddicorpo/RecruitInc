import 'mocha';
import { expect } from 'chai';
import { ObtainCandidatesCommand } from '../../../src/domain/command/ObtainCandidatesCommand';require('dotenv').config(); //Get environment variables

describe('Query created to fetch users either with different languages and filters, or by username', () => {
  it('Should return the right query when no language or framework is passed', async () => {
    // GIVEN
    const obtainCandidatesCommand: ObtainCandidatesCommand = new ObtainCandidatesCommand();
    const filters: string[] = [];

    // WHEN
    const actual: {} = obtainCandidatesCommand.getQuery(filters);

    // THEN
    expect('{}').to.equal(JSON.stringify(actual));
  });

  it('Should return the right query when a single language is passed', async () => {
    // GIVEN
    const obtainCandidatesCommand: ObtainCandidatesCommand = new ObtainCandidatesCommand();
    const filters: string[] = ['java'];

    // WHEN
    const actual: {} = obtainCandidatesCommand.getQuery(filters);

    // THEN
    expect(
      '{"iGit.IGitData.gitProjectSummary.totalOutput":{"$all":[{"$elemMatch":{"languageOrFramework":"Java","$and":[{"linesOfCode":{"$gt":0}},{"numberOfCommits":{"$gt":0}}]}}]}}'
    ).to.equal(JSON.stringify(actual));
  });

  it('Should return the right query when two languages are passed', async () => {
    // GIVEN
    const obtainCandidatesCommand: ObtainCandidatesCommand = new ObtainCandidatesCommand();
    const filters: string[] = ['java', 'javascript'];

    // WHEN
    const actual: {} = obtainCandidatesCommand.getQuery(filters);

    // THEN
    expect(
      '{"iGit.IGitData.gitProjectSummary.totalOutput":{"$all":[{"$elemMatch":{"languageOrFramework":"Java","$and":[{"linesOfCode":{"$gt":0}},{"numberOfCommits":{"$gt":0}}]}},{"$elemMatch":{"languageOrFramework":"Javascript","$and":[{"linesOfCode":{"$gt":0}},{"numberOfCommits":{"$gt":0}}]}}]}}'
    ).to.equal(JSON.stringify(actual));
  });

  it('Should return the right query when a language and a framework are passed', async () => {
    // GIVEN
    const obtainCandidatesCommand: ObtainCandidatesCommand = new ObtainCandidatesCommand();
    const filters: string[] = ['java', 'javascript'];

    // WHEN
    const actual: {} = obtainCandidatesCommand.getQuery(filters);

    // THEN
    expect(
      '{"iGit.IGitData.gitProjectSummary.totalOutput":{"$all":[{"$elemMatch":{"languageOrFramework":"Java","$and":[{"linesOfCode":{"$gt":0}},{"numberOfCommits":{"$gt":0}}]}},{"$elemMatch":{"languageOrFramework":"Javascript","$and":[{"linesOfCode":{"$gt":0}},{"numberOfCommits":{"$gt":0}}]}}]}}'
    ).to.equal(JSON.stringify(actual));
  });

  it('Should return the right query when a single framework is passed', async () => {
    // GIVEN
    const obtainCandidatesCommand: ObtainCandidatesCommand = new ObtainCandidatesCommand();
    const filters: string[] = ['angular'];

    // WHEN
    const actual: {} = obtainCandidatesCommand.getQuery(filters);

    // THEN
    expect(
      '{"iGit.IGitData.gitProjectSummary.totalOutput":{"$all":[{"$elemMatch":{"languageOrFramework":"Javascript","$and":[{"linesOfCode":{"$gt":0}},{"numberOfCommits":{"$gt":0}},{"frameworks":{"$elemMatch":{"technologyName":"Angular","$and":[{"linesOfCode":{"$gt":0}},{"numberOfCommits":{"$gt":0}}]}}}]}}]}}'
    ).to.equal(JSON.stringify(actual));
  });

  it('Should return the right query when a username is passed', async () => {
    // GIVEN
    const obtainCandidatesCommand: ObtainCandidatesCommand = new ObtainCandidatesCommand();
    const username = 'bob-test';

    // WHEN
    const actual: {} = obtainCandidatesCommand.getUserQuery(username);

    // THEN
    expect('{"platformUsername":"bob-test"}').to.equal(JSON.stringify(actual));
  });
});
