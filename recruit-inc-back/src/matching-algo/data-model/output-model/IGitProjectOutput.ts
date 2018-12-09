import { ILanguageOutput } from './ILanguageOutput';
export interface IGitProjectOutput {
  projectName: string;
  projectUrlÉ?: string;
  languageOutput: ILanguageOutput[];
}
