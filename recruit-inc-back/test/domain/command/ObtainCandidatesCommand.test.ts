import 'mocha';
import { InsertCandidateCommand } from '../../../src/domain/command/InsertCandidateCommand';
import {
  IApplicantModel,
  UserType,
} from '../../../src/domain/model/IApplicantModel';
import { Platform } from '../../../src/domain/model/IGitDataModel';
import { expect } from 'chai';
import { MongoConnectionFactory } from '../../../src/data-source/db-registry/mongo/MongoConnectionFactory';
import * as mongoose from 'mongoose';
import { ObtainCandidatesCommand } from '../../../src/domain/command/ObtainCandidatesCommand';
import { MatcherClient } from '../../../src/matching-algo/matcher-client/MatcherClient';
import { IGitProjectSummary } from '../../../src/matching-algo/data-model/output-model/IGitProjectSummary';
import { IGitProjectOutput } from '../../../src/matching-algo/data-model/output-model/IGitProjectOutput';
require('dotenv').config(); //Get environment variables

describe('Query created to fetch different languages and filters', () => {
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
});
