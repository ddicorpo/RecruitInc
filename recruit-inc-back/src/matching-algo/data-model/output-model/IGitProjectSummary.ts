import {ILanguageOutput} from "./ILanguageOutput";
import {IGitProjectOutput} from "./IGitProjectOutput";

export interface IGitProjectSummary {
    totalOutput: ILanguageOutput[],
    projectsOutput: IGitProjectOutput[]
}