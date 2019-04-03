import { AbstractLanguageMatcher } from '../matcher/AbstractLanguageMatcher';
import { IGitProjectOutput } from '../data-model/output-model/IGitProjectOutput';
import { IDataEntry } from '../data-model/input-model/IDataEntry';
import { IGitProjectInput } from '../data-model/input-model/IGitProjectInput';
import { ILanguageOutput } from '../data-model/output-model/ILanguageOutput';
import { allMatchers } from './AllMatchers';
import { Technologies } from '../data-model/output-model/Technologies';
import { IFrameworkOutput } from '../data-model/output-model/IFrameworkOutput';
import { IGitProjectSummary } from '../data-model/output-model/IGitProjectSummary';
import { Logger } from '../../Logger';

export class MatcherClient {
  private languageMatchers: AbstractLanguageMatcher[] = [];
  private dataEntry: IDataEntry;
  private logger: Logger;

  public constructor(
    dataEntry: IDataEntry,
    languageMatchers: AbstractLanguageMatcher[] = allMatchers,
    logger?: Logger
  ) {
    this.dataEntry = dataEntry;
    this.languageMatchers = languageMatchers;
    if (logger) {
      this.logger = logger;
    } else {
      this.logger = new Logger();
    }
  }

  public execute(): IGitProjectSummary {
    const allProjects: IGitProjectInput[] = this.dataEntry.projectInputs;

    const projectOutputs: IGitProjectOutput[] = [];
    for (const project of allProjects) {
      this.logger.info({
        class: 'MatcherClient',
        method: 'execute',
        action: 'Start Analysis with project ' + project.projectName,
        params: {},
      });
      const languageOutputs: ILanguageOutput[] = [];

      for (const matcher of this.languageMatchers) {
        matcher.setProjectInput(project);
        languageOutputs.push(matcher.execute() as ILanguageOutput);
      }

      const projectOutput: IGitProjectOutput = {
        projectName: project.projectName,
        languageOutput: languageOutputs,
      };

      projectOutputs.push(projectOutput);
      this.logger.info({
        class: 'MatcherClient',
        method: 'execute',
        action: 'End Analysis with projectOuput ' + projectOutput.projectName,
        params: {},
      });
    }

    const languages: ILanguageOutput[] = [];
    for (const languageMatcher of this.languageMatchers) {
      const languageTech: Technologies = languageMatcher.getTechnology();
      const frameworks: IFrameworkOutput[] = [];
      let indexedFrameworkMap: Map<Technologies, number> = new Map<
        Technologies,
        number
      >();
      let indexHelper: number = 0;
      for (const framework of languageMatcher.getFrameworks()) {
        frameworks.push({
          technologyName: framework.getTechnology(),
          numberOfCommits: 0,
          linesOfCode: 0,
          ratio: 0
        });
        indexedFrameworkMap.set(framework.getTechnology(), indexHelper);
        indexHelper++;
      }
      const language: ILanguageOutput = {
        languageOrFramework: languageTech,
        linesOfCode: 0,
        numberOfCommits: 0,
        ratio: 0,
        frameworks: frameworks,
      };

      for (const projectOutput of projectOutputs) {
        //Select the right constant
        const languageOutputs: ILanguageOutput[] = projectOutput.languageOutput;
        let targetedFrameworksStats: IFrameworkOutput[] = [];
        let targetLangStats: ILanguageOutput;
        // Grab the frameworks and Language in list of Languages...
        for (let languageOutput of languageOutputs) {
          if (languageOutput.languageOrFramework === languageTech) {
            targetLangStats = languageOutput;
            targetedFrameworksStats = languageOutput.frameworks;
            break;
          }
        }
        //Check if the current Language has line or commit before going further...
        if (
          targetLangStats.linesOfCode != 0 ||
          targetLangStats.numberOfCommits !== 0
        ) {
          // Adding Language Stats
          language.linesOfCode += targetLangStats.linesOfCode;
          language.numberOfCommits += targetLangStats.numberOfCommits;

          // Adding the Framework Stats
          for (const computedFrameworkStat of targetedFrameworksStats) {
            const indexOfFramework: number = indexedFrameworkMap.get(
              computedFrameworkStat.technologyName as Technologies
            );
            language.frameworks[indexOfFramework].linesOfCode +=
              computedFrameworkStat.linesOfCode;
            language.frameworks[indexOfFramework].numberOfCommits +=
              computedFrameworkStat.numberOfCommits;
          }
        }
      }
      languages.push(language);
    }
    const projectSummary: IGitProjectSummary = {
      totalOutput: languages,
      projectsOutput: projectOutputs,
    };

    return projectSummary;
  }
}
