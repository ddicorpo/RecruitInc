import 'mocha';
import { expect } from 'chai';
import { ObtainRankedCandidatesCommand } from '../../../src/domain/command/ObtainRankedCandidatesCommand';

require('dotenv').config(); //Get environment variables

describe('Query created to fetch different filters', () => {
  it('Should return the right ranked query when single language is passed', async () => {
    // GIVEN
    const obtainCandidatesCommand: ObtainRankedCandidatesCommand = new ObtainRankedCandidatesCommand();
    const filters: string[] = ['java'];

    // WHEN
    const actual: {} = obtainCandidatesCommand.getRankingQuery(filters);

    // THEN
    expect(
      '{"$addFields":{"totalLOCQueried":{"$sum":{"$map":{"input":"$tmp.gitProjectSummary.totalOutput","as":"totalOutput","in":{"$cond":{"if":{"$or":[{"$eq":["$$totalOutput.languageOrFramework","Java"]}]},"then":{"$add":[{"$sum":{"$map":{"input":"$$totalOutput.frameworks","as":"frameworks","in":{"$cond":{"if":{"$or":[]},"then":"$$frameworks.linesOfCode","else":0}}}}},"$$totalOutput.linesOfCode"]},"else":0}}}}},"totalCommitsQueried":{"$sum":{"$map":{"input":"$tmp.gitProjectSummary.totalOutput","as":"totalOutput","in":{"$cond":{"if":{"$or":[{"$eq":["$$totalOutput.languageOrFramework","Java"]}]},"then":{"$add":[{"$sum":{"$map":{"input":"$$totalOutput.frameworks","as":"frameworks","in":{"$cond":{"if":{"$or":[]},"then":"$$frameworks.numberOfCommits","else":0}}}}},"$$totalOutput.numberOfCommits"]},"else":0}}}}}}}'
    ).to.equal(JSON.stringify(actual));
  });

  it('Should return the right ranked query when two languages are passed', async () => {
    // GIVEN
    const obtainCandidatesCommand: ObtainRankedCandidatesCommand = new ObtainRankedCandidatesCommand();
    const filters: string[] = ['python', 'javascript'];

    // WHEN
    const actual: {} = obtainCandidatesCommand.getRankingQuery(filters);

    // THEN
    expect(
      '{"$addFields":{"totalLOCQueried":{"$sum":{"$map":{"input":"$tmp.gitProjectSummary.totalOutput","as":"totalOutput","in":{"$cond":{"if":{"$or":[{"$eq":["$$totalOutput.languageOrFramework","Python"]},{"$eq":["$$totalOutput.languageOrFramework","Javascript"]}]},"then":{"$add":[{"$sum":{"$map":{"input":"$$totalOutput.frameworks","as":"frameworks","in":{"$cond":{"if":{"$or":[]},"then":"$$frameworks.linesOfCode","else":0}}}}},"$$totalOutput.linesOfCode"]},"else":0}}}}},"totalCommitsQueried":{"$sum":{"$map":{"input":"$tmp.gitProjectSummary.totalOutput","as":"totalOutput","in":{"$cond":{"if":{"$or":[{"$eq":["$$totalOutput.languageOrFramework","Python"]},{"$eq":["$$totalOutput.languageOrFramework","Javascript"]}]},"then":{"$add":[{"$sum":{"$map":{"input":"$$totalOutput.frameworks","as":"frameworks","in":{"$cond":{"if":{"$or":[]},"then":"$$frameworks.numberOfCommits","else":0}}}}},"$$totalOutput.numberOfCommits"]},"else":0}}}}}}}'
    ).to.equal(JSON.stringify(actual));
  });

  it('Should return the right ranked query when a single framework is passed', async () => {
    // GIVEN
    const obtainCandidatesCommand: ObtainRankedCandidatesCommand = new ObtainRankedCandidatesCommand();
    const filters: string[] = ['react'];

    // WHEN
    const actual: {} = obtainCandidatesCommand.getRankingQuery(filters);
    console.log('actual');
    console.log(JSON.stringify(actual));
    // THEN
    expect(
      '{"$addFields":{"totalLOCQueried":{"$sum":{"$map":{"input":"$tmp.gitProjectSummary.totalOutput","as":"totalOutput","in":{"$cond":{"if":{"$or":[{"$eq":["$$totalOutput.languageOrFramework","Javascript"]}]},"then":{"$sum":{"$map":{"input":"$$totalOutput.frameworks","as":"frameworks","in":{"$cond":{"if":{"$or":[{"$eq":["$$frameworks.technologyName","React"]}]},"then":"$$frameworks.linesOfCode","else":0}}}}},"else":0}}}}},"totalCommitsQueried":{"$sum":{"$map":{"input":"$tmp.gitProjectSummary.totalOutput","as":"totalOutput","in":{"$cond":{"if":{"$or":[{"$eq":["$$totalOutput.languageOrFramework","Javascript"]}]},"then":{"$sum":{"$map":{"input":"$$totalOutput.frameworks","as":"frameworks","in":{"$cond":{"if":{"$or":[{"$eq":["$$frameworks.technologyName","React"]}]},"then":"$$frameworks.numberOfCommits","else":0}}}}},"else":0}}}}}}}'
    ).to.equal(JSON.stringify(actual));
  });
});
