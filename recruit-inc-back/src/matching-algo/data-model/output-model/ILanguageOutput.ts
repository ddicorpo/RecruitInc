import { IFrameworkOutput } from './IFrameworkOutput';
import { Technologies } from './Technologies';
import { ICodeOutput } from './ICodeOutput';

export interface ILanguageOutput extends ICodeOutput {
  languageOrFramework: Technologies | string;
  frameworks: IFrameworkOutput[];
}
