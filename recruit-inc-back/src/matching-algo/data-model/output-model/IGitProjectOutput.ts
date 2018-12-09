import { ILanguageOutput } from './ILanguageOutput';
export interface IGitProjectOutput {
  projectName: string;
  projectUrl?: string;
  languageOutput: ILanguageOutput[];
}
