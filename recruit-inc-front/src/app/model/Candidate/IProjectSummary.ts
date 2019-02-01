import { ILanguageOutput } from './ILanguageOutput';
import { IGitProjectOutput } from './IGitProjectOuput';

export interface IProjectSummary {
  totalOutput: ILanguageOutput[];
  projectOutput: IGitProjectOutput[];
}
