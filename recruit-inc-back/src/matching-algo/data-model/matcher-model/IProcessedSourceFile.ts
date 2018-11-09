import { ISourceFiles } from '../input-model/ISourceFiles';

export interface IProcessedSourceFile extends ISourceFiles {
  isMatchingTechnology: boolean;
}
