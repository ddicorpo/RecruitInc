import { AbstractCommand } from './AbstractCommand';
import { RequestContext } from './RequestContext';
import { ApplicantFinder } from '../../data-source/finder/ApplicantFinder';
import { IApplicantModel } from '../model/IApplicantModel';
import { allMatchers } from '../../matching-algo/matcher-client/AllMatchers';
import { AbstractLanguageMatcher } from '../../matching-algo/matcher/AbstractLanguageMatcher';
import { Technologies } from '../../matching-algo/data-model/output-model/Technologies';

export interface ITechnology {
  [key: string]: string[];
}

export interface ILanguageAndFrameworkPair {
  language: string;
  framework?: string;
}

// Usually you want to go through a factory/Data Mapper model
// This is a temporary command

export class ObtainCandidatesCommand extends AbstractCommand {
  private languagesAndFrameworkSupported: AbstractLanguageMatcher[] = allMatchers;

  private queryExclude: {} = {
    'iGit.IGitData.dataEntry.projectInputs.applicantCommits': 0,
    'iGit.IGitData.dataEntry.projectInputs.projectStructure': 0,
    'iGit.IGitData.dataEntry.projectInputs.downloadedSourceFile': 0,
    'iGit.IToken': 0,
  };

  private finder: ApplicantFinder = new ApplicantFinder();
  constructor(applicationContext?: RequestContext) {
    super();
  }
  public async getCandidates(page: number, filters: string[]): Promise<any> {
    try {
      const query: {} = this.getQuery(filters);

      //Prevent crash of the application by inserting page=-1 or page=0
      if (page < 1) {
        page = 1;
      }
      let allCandidates: IApplicantModel = await this.finder.findByPageQuery(
        query,
        page,
        this.queryExclude
      );
      return JSON.stringify(allCandidates);
    } catch (CommandException) {
      throw CommandException;
    }
  }

  public async getAllCandidates(): Promise<any> {
    try {
      let allCandidates: IApplicantModel = await this.finder.findAll();
      return JSON.stringify(allCandidates);
    } catch (CommandException) {
      throw CommandException;
    }
  }

  public async getCandidatesTechnologies(
    page: number,
    filter: string
  ): Promise<any> {
    try {
      // query to filter technology for a specific candidate

      const query = undefined;

      if (page < 1) {
        page = 1;
      }

      let CandidatesTechnologies: IApplicantModel = await this.finder.findByPageQuery(
        query,
        page
      );
      return JSON.stringify(CandidatesTechnologies);
    } catch (CommandException) {
      throw CommandException;
    }
  }

  public getQuery(filters: string[]): {} {
    let findQuery: {} =
      filters.length > 0
        ? {
            'iGit.IGitData.gitProjectSummary.totalOutput': {
              $all: this.getFilterMatch(filters),
            },
          }
        : {};

    return findQuery;
  }

  private getTechnologiesSupported(): ITechnology {
    const technologies: {} = {};
    for (const language of this.languagesAndFrameworkSupported) {
      const frameworks = language.getFrameworks();
      const frameworkArray: Technologies[] = [];
      for (const framework of frameworks) {
        frameworkArray.push(framework.getTechnology());
      }
      technologies[language.getTechnology()] = frameworkArray;
    }

    // Returns something like this:
    // {"Javascript":["React","Typescript","Vue","Angular"],"Python":["Django","Flask"],"Csharp":[],"Java":[],"Ruby":[]}
    return technologies;
  }

  // This monstrosity of a method will generate the object corresponding to a query similar to this:
  //   [
  //       {
  //         $elemMatch:
  //               {
  //                   languageOrFramework: "Java",
  //                   "$and":
  //                       [
  //                           {linesOfCode: {$gt: 0}},
  //                           {numberOfCommits: {$gt : 0}}
  //                       ]
  //               }
  //       },
  //       {
  //         $elemMatch:
  //             {
  //               languageOrFramework: "Javascript",
  //               "$and":
  //                   [
  //                       {linesOfCode: {$gt: 0}},
  //                       {numberOfCommits: {$gt : 0}},
  //                       {
  //                         frameworks:
  //                             {
  //                               $elemMatch:
  //                                   {
  //                                     technologyName: "React",
  //                                     "$and":
  //                                         [
  //                                             {linesOfCode: { $gt: 0}},
  //                                             {numberOfCommits: {$gt: 0}}
  //                                         ]
  //                                   }
  //                             }
  //                       }
  //             }
  //       }
  //   ]

  private getFilterMatch(filters: string[]) {
    const cleanedFilters: Set<string> = new Set<string>();
    for (const filter of filters) {
      cleanedFilters.add(filter.toLowerCase());
    }

    // {"Javascript":["React","Typescript","Vue","Angular"],"Python":["Django","Flask"],"Csharp":[],"Java":[],"Ruby":[]}
    const technologies: ITechnology = this.getTechnologiesSupported();

    const elementsToProcess: ILanguageAndFrameworkPair[] = this.getPairsOfLanguageAndFrameworks(
      cleanedFilters,
      technologies
    );

    const technologiesToQuery: ITechnology = this.getTechnologiesToQuery(
      elementsToProcess
    );

    // ["Javascript", "Python", "Csharp", "Java", "Ruby"]
    const languages: string[] = Object.keys(technologiesToQuery);

    const languagesQuery: {}[] = [];

    for (const language of languages) {
      const languageCriterias: {}[] = [];
      languageCriterias.push({ linesOfCode: { $gt: 0 } });
      languageCriterias.push({ numberOfCommits: { $gt: 0 } });

      const frameworks: string[] = technologiesToQuery[language];
      for (const framework of frameworks) {
        languageCriterias.push({
          frameworks: {
            $elemMatch: {
              technologyName: framework,
              $and: [
                { linesOfCode: { $gt: 0 } },
                { numberOfCommits: { $gt: 0 } },
              ],
            },
          },
        });
      }

      languagesQuery.push({
        $elemMatch: {
          languageOrFramework: language,
          $and: languageCriterias,
        },
      });
    }
    return languagesQuery;
  }

  private getPairsOfLanguageAndFrameworks(
    filters: Set<string>,
    technologies: ITechnology
  ): ILanguageAndFrameworkPair[] {
    const elementsToProcess: ILanguageAndFrameworkPair[] = [];
    for (const languageOrFramework of filters) {
      const languageFrameworkPairs = this.generateLanguageFrameworkPair(
        languageOrFramework,
        technologies
      );
      if (languageFrameworkPairs !== null) {
        elementsToProcess.push(languageFrameworkPairs);
      }
    }
    return elementsToProcess;
  }

  private getTechnologiesToQuery(
    elementsToProcess: ILanguageAndFrameworkPair[]
  ) {
    const technologiesToQuery: ITechnology = {};
    const encountedLanguages: Set<string> = new Set<string>();
    for (const element of elementsToProcess) {
      const language: string = element.language;
      const framework: string = element.framework;
      if (encountedLanguages.has(language)) {
        if (framework !== undefined) {
          technologiesToQuery[element.language].push(framework);
        }
      } else {
        encountedLanguages.add(language);
        technologiesToQuery[language] =
          framework !== undefined ? [framework] : [];
      }
    }
    return technologiesToQuery;
  }

  private generateLanguageFrameworkPair(
    target: string,
    technologies: ITechnology
  ): ILanguageAndFrameworkPair {
    const languages: string[] = Object.keys(technologies);
    const languageSet: Set<string> = new Set<string>();

    for (const language of languages) {
      languageSet.add(language.toLowerCase());
    }

    if (languageSet.has(target)) {
      for (const language of languages) {
        if (language.toLowerCase() === target.toLowerCase()) {
          return { language };
        }
      }
    } else {
      for (const language of languages) {
        const frameworks: string[] = technologies[language];
        for (const framework of frameworks) {
          if (framework.toLowerCase() === target.toLowerCase()) {
            return { framework, language };
          }
        }
      }
    }
    return null;
  }
}
