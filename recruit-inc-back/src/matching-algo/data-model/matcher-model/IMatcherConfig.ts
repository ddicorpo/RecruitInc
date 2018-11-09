import { Technologies } from '../output-model/Technologies';
import { ITargetMatcher } from './ITargetMatcher';

export interface IMatcherConfig {
  technology: Technologies;
  extensions: string[];
  matchingTargets: ITargetMatcher[];
  // Example in Javascript it's "src/"
  sourceFolder?: string;
  // e.g A vendor folder name like node_modules
  excludedFolders?: string[];
}
