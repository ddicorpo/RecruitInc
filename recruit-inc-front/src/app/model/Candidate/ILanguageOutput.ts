import { ICodeOutput } from './ICodeOutput';
import { IFrameworkOutput } from './IFrameworkOutput';

export interface ILanguageOutput extends ICodeOutput {
  languageOrFramework: string;
  frameworks: IFrameworkOutput[];
}
