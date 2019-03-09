import { ICandidate } from '../model/Candidate/ICandidate';
import { IProjectSummary } from '../model/Candidate/IProjectSummary';
import { IGitProjectInput } from '../model/Candidate/IGitProjectInput';

/**
 * This class prevents dependency between our domain model back-end
 * and our domain model front-end, by converting our back-end data
 * schema to front-end data schema
 */
export class CandidateAdapter {
  constructor() {}

  public adapt(result): ICandidate[] {
    let candidates: ICandidate[] = [];
    let num: number;

    for (num = 0; num < result.length; num++) {
      //Adaptation of 1 user can fail but we don't want all users to fail because of one.
      try {
        let projectSummary: IProjectSummary = {
          totalOutput:
            result[num].iGit.IGitData[0].gitProjectSummary.totalOutput,
          projectOutput:
            result[num].iGit.IGitData[0].gitProjectSummary.projectsOutput,
        };

        // Assign Email iff email contains '@'
        let emailValidator: string = 'empty';
        if (
          result[num].platformEmail != null &&
          result[num].platformEmail != undefined &&
          result[num].platformEmail.includes('@')
        ) {
          emailValidator = result[num].platformEmail;
        }

        let projectInputsRaw: IGitProjectInput[] = [];
        for (let projectInp of result[num].iGit.IGitData[0].dataEntry
          .projectInputs) {
          const projectInput: IGitProjectInput = {
            projectName: projectInp.projectName,
            owner: projectInp.owner,
          };
          projectInputsRaw.push(projectInput);
        }

        let candidate: ICandidate = {
          isFilter: false,
          username: result[num].platformUsername,
          profileLink: 'https://www.github.com/' + result[num].platformUsername,
          userType: result[num].userType,
          email: emailValidator,
          projectSummary: projectSummary,
          projectInputs: projectInputsRaw,
        };

        candidates.push(candidate);
      } catch (Exception) {
        console.log("can't adapt user " + result[num].platformUsername);
      }
    }
    return candidates;
  }
}
