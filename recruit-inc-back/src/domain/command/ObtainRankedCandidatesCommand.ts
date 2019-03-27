import { AbstractCommand } from './AbstractCommand';
import { RequestContext } from './RequestContext';
import { ApplicantFinder } from '../../data-source/finder/ApplicantFinder';
import { IApplicantModel } from '../model/IApplicantModel';
import { allMatchers } from '../../matching-algo/matcher-client/AllMatchers';
import { AbstractLanguageMatcher } from '../../matching-algo/matcher/AbstractLanguageMatcher';
import { Technologies } from '../../matching-algo/data-model/output-model/Technologies';
import {
  ILanguageAndFrameworkPair,
  ITechnology,
} from './ObtainCandidatesCommand';

export class ObtainRankedCandidatesCommand extends AbstractCommand {
  private languagesAndFrameworkSupported: AbstractLanguageMatcher[] = allMatchers;

  private queryExclude: {} = {
    $project: {
      'iGit.IGitData.dataEntry.projectInputs.applicantCommits': 0,
      'iGit.IGitData.dataEntry.projectInputs.projectStructure': 0,
      'iGit.IGitData.dataEntry.projectInputs.downloadedSourceFile': 0,
      'iGit.IToken': 0,
    },
  };

  private queryTmp: {} = {
    $addFields: { tmp: { $arrayElemAt: ['$iGit.IGitData', 0] } },
  };

  private queryRemoveTmp: {} = { $project: { tmp: 0 } };

  private querySort: {} = {
    $sort: { totalLOCQueried: -1, totalCommitsQueried: -1 },
  };

  private finder: ApplicantFinder = new ApplicantFinder();
  constructor(applicationContext?: RequestContext) {
    super();
  }
  public async getCandidates(page: number, filters: string[]): Promise<any> {
    try {
      const matchingQuery: {} = this.getMatchingQuery(filters);

      //Prevent crash of the application by inserting page=-1 or page=0
      if (page < 1) {
        page = 1;
      }

      const rankQuery: {} = this.getRankingQuery(filters);

      const aggregateQuery: {}[] = [
        matchingQuery,
        this.queryExclude,
        this.queryTmp,
        rankQuery,
        this.queryRemoveTmp,
        this.querySort,
      ];

      console.log(
        'THIS IS ALL TEH TECHSSS',
        JSON.stringify(this.flattenTechnologySupported())
      );

      console.log(
        '\n\n\nTHIS IS THE QUERY!!!\n\n\n',
        JSON.stringify(aggregateQuery)
      );
      return new Promise(() => {
        console.log('HERE IS YOUR PROMISE!!');
      });

      // let allCandidates: IApplicantModel = await this.finder.findRankedPaginatedQuery(
      //   [matchingQuery, this.queryExclude],
      //   page
      // );
      // return JSON.stringify(allCandidates);
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

  private getNewRankingFields(filters: string[]): {} {
    return {
      totalLOCQueried: this.getRankingMatch(filters, 'linesOfCode'),
      totalCommitsQueried: this.getRankingMatch(filters, 'numberOfCommits'),
    };
  }

  private getRankingMatch(filters: string[], target: string): {} {
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

    const languagesInFilters: Set<string> = this.getLanguageSetUserAskedFor(
      filters
    );
    const languagesNotToCount: string[] = [];
    const languagesToCount: string[] = [];
    for (const language of languages) {
      // This is for the case where the user wants to count people that have LOC in React but not count Javascript
      const isLanguageOnlyHereForFramework: boolean = !languagesInFilters.has(
        language.toLowerCase()
      );
      if (isLanguageOnlyHereForFramework) {
        languagesNotToCount.push(language);
      } else {
        languagesToCount.push(language);
      }
    }

    const hasLanguagesToCount: boolean = languagesToCount.length > 0;
    const hasLanguagesToSkipContainingFrameworksToCount: boolean =
      languagesNotToCount.length > 0;

    const matchingLanguageToCountArray = this.getMongoTechnologyArrayOfConditions(
      '$$totalOutput.languageOrFramework',
      languagesToCount
    );

    const matchingLanguageNotToCountArray: {}[] = this.getMongoTechnologyArrayOfConditions(
      '$$totalOutput.languageOrFramework',
      languagesNotToCount
    );

    const frameworksBelongingToLanguagesToCount: string[] = this.getFrameworksRelatedToLanguageArray(
      languagesToCount,
      technologiesToQuery
    );

    const frameworksBelongingToLanguagesNotToCount: string[] = this.getFrameworksRelatedToLanguageArray(
      languagesNotToCount,
      technologiesToQuery
    );

    const languageTarget: string = '$$totalOutput.'.concat(target);
    const frameworkTarget: string = '$$frameworks.'.concat(target);

    let insideRankQuery: {};
    if (hasLanguagesToCount && !hasLanguagesToSkipContainingFrameworksToCount) {
      insideRankQuery = {
        $cond: {
          if: {
            $or: matchingLanguageToCountArray,
          },
          then: {
            $add: [
              {
                $sum: {
                  $map: {
                    input: '$$totalOutput.frameworks',
                    as: 'frameworks',
                    in: {
                      $cond: {
                        if: {
                          $or: this.getMongoTechnologyArrayOfConditions(
                            '$$frameworks.technologyName',
                            frameworksBelongingToLanguagesToCount
                          ),
                        },
                        then: {
                          frameworkTarget,
                        },
                        else: 0,
                      },
                    },
                  },
                },
              },
              languageTarget,
            ],
          },
          else: 0,
        },
      };
    } else if (
      !hasLanguagesToCount &&
      hasLanguagesToSkipContainingFrameworksToCount
    ) {
      insideRankQuery = {
        $cond: {
          if: {
            $or: matchingLanguageNotToCountArray,
          },
          then: {
            $sum: {
              $map: {
                input: '$$totalOutput.frameworks',
                as: 'frameworks',
                in: {
                  $cond: {
                    if: {
                      $or: this.getMongoTechnologyArrayOfConditions(
                        '$$frameworks.technologyName',
                        frameworksBelongingToLanguagesNotToCount
                      ),
                    },
                    then: {
                      frameworkTarget,
                    },
                    else: 0,
                  },
                },
              },
            },
          },
          else: 0,
        },
      };
    } else if (
      hasLanguagesToCount &&
      hasLanguagesToSkipContainingFrameworksToCount
    ) {
      insideRankQuery = {
        $cond: {
          if: {
            $or: matchingLanguageToCountArray,
          },
          then: {
            $add: [
              {
                $sum: {
                  $map: {
                    input: '$$totalOutput.frameworks',
                    as: 'frameworks',
                    in: {
                      $cond: {
                        if: {
                          $or: this.getMongoTechnologyArrayOfConditions(
                            '$$frameworks.technologyName',
                            frameworksBelongingToLanguagesToCount
                          ),
                        },
                        then: {
                          frameworkTarget,
                        },
                        else: 0,
                      },
                    },
                  },
                },
              },
              languageTarget,
            ],
          },
          else: {
            $cond: {
              if: {
                $or: matchingLanguageNotToCountArray,
              },
              then: {
                $sum: {
                  $map: {
                    input: '$$totalOutput.frameworks',
                    as: 'frameworks',
                    in: {
                      $cond: {
                        if: {
                          $or: this.getMongoTechnologyArrayOfConditions(
                            '$$frameworks.technologyName',
                            frameworksBelongingToLanguagesNotToCount
                          ),
                        },
                        then: {
                          frameworkTarget,
                        },
                        else: 0,
                      },
                    },
                  },
                },
              },
              else: 0,
            },
          },
        },
      };
    } else {
      // This case is supposed to be impossible
    }

    // const insideMap: {} = {$cond: {if: {$or: }}}
    const sum: {} = {
      $sum: {
        $map: {
          input: '$tmp.gitProjectSummary.totalOutput',
          as: 'totalOutput',
          in: insideRankQuery,
        },
      },
    };

    return sum;
  }

  private getFrameworksRelatedToLanguageArray(
    languagesToCount: string[],
    technologiesToQuery: ITechnology
  ): string[] {
    const frameworkArray: string[] = [];
    for (const language of languagesToCount) {
      const frameworks: string[] = technologiesToQuery[language];
      for (const framework of frameworks) {
        frameworkArray.push(framework);
      }
    }
    return frameworkArray;
  }

  private getMongoTechnologyArrayOfConditions(
    expression: string,
    languagesToCount: string[]
  ) {
    const matchingLanguageToCountArray: {}[] = [];
    for (const language of languagesToCount) {
      matchingLanguageToCountArray.push({ $eq: [expression, language] });
    }
    return matchingLanguageToCountArray;
  }

  public getRankingQuery(filters: string[]): {} {
    let findQuery: {} = {
      $addFields:
        filters.length > 0
          ? this.getNewRankingFields(filters)
          : this.getNewRankingFields(this.flattenTechnologySupported()),
    };

    return findQuery;
  }

  public getMatchingQuery(filters: string[]): {} {
    let findQuery: {} =
      filters.length > 0
        ? {
            $match: {
              'iGit.IGitData.gitProjectSummary.totalOutput': {
                $all: this.getFilterMatch(filters),
              },
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

  private flattenTechnologySupported(): string[] {
    const technologies: ITechnology = this.getTechnologiesSupported();
    const techList: string[] = [];
    const languages: string[] = Object.keys(technologies);
    for (const language of languages) {
      techList.push(language);
      for (const framework of technologies[language]) {
        techList.push(framework);
      }
    }
    return techList;
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

  private getLanguageSetUserAskedFor(filters: string[]): Set<string> {
    const languages: Set<string> = new Set<string>();
    const technologies: ITechnology = this.getTechnologiesSupported();
    const languagesSupported: string[] = Object.keys(technologies);
    for (const language of languagesSupported) {
      languages.add(language.toLowerCase());
    }
    return languages;
  }
}
