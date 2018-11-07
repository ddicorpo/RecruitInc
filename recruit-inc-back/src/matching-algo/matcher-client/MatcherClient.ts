import {AbstractLanguageMatcher} from "../matcher/AbstractLanguageMatcher";
import {IGitProjectOutput} from "../data-model/output-model/IGitProjectOutput";
import {IDataEntry} from "../data-model/input-model/IDataEntry";
import {IGitProjectInput} from "../data-model/input-model/IGitProjectInput";
import {ILanguageOutput} from "../data-model/output-model/ILanguageOutput";
import {allMatchers} from "./AllMatchers";
import {Technologies} from "../data-model/output-model/Technologies";
import {IFrameworkOutput} from "../data-model/output-model/IFrameworkOutput";
import {IGitProjectSummary} from "../data-model/output-model/IGitProjectSummary";

export class MatcherClient {


    private languageMatchers: AbstractLanguageMatcher[] = [];
    private dataEntry: IDataEntry;
    private logger = require("../../logger.js");

    public constructor(dataEntry: IDataEntry, languageMatchers: AbstractLanguageMatcher[] = allMatchers) {
        this.dataEntry = dataEntry;
        this.languageMatchers = languageMatchers;
    }

    //TODO: Refactor this Big Big(O) loop
    public execute(): IGitProjectSummary{
        const allProjects: IGitProjectInput[] = this.dataEntry.projectInputs;

        const projectOutputs: IGitProjectOutput[] = [];
        for (const project of allProjects) {
            this.logger.info({
                    class: "MatcherClient", method: "execute",
                    action: "Start Analysis with project " + project.projectName, params: {}
                },
                {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});
            const languageOutputs: ILanguageOutput[] = [];

            for (const matcher of this.languageMatchers) {
                matcher.setProjectInput(project);
                languageOutputs.push(matcher.execute() as ILanguageOutput);

            }

            const projectOutput: IGitProjectOutput = {
                projectName: project.projectName,
                languageOutput: languageOutputs
            };

            projectOutputs.push(projectOutput);
            this.logger.info({
                    class: "MatcherClient", method: "execute",
                    action: "End Analysis with projectOuput " + projectOutput.projectName, params: {}
                },
                {timestamp: (new Date()).toLocaleTimeString(), processID: process.pid});

        }

        const languages: ILanguageOutput[] = [];
        for (const languageMatcher of this.languageMatchers) {
            const languageTech: Technologies = languageMatcher.getTechnology();
            const frameworks: IFrameworkOutput[] = [];
            for (const framework of languageMatcher.getFrameworks()) {
                frameworks.push({
                    technologyName: framework.getTechnology(),
                    numberOfCommits: 0,
                    linesOfCode: 0,
                })
            }
            const language: ILanguageOutput = {
                languageOrFramework: languageTech,
                linesOfCode: 0,
                numberOfCommits: 0,
                frameworks: frameworks,
            };

            for (const projectOutput of projectOutputs) {


                const languageOutputs: ILanguageOutput[] = projectOutput.languageOutput;

                for (const languageOutput of languageOutputs) {
                    if(languageOutput.linesOfCode > 0){
                        language.linesOfCode += languageOutput.linesOfCode;
                    }
                    language.numberOfCommits += languageOutput.numberOfCommits;

                    for (const frameworkOutput of languageOutput.frameworks) {
                        for (const framework of language.frameworks) {
                            if (framework.technologyName === frameworkOutput.technologyName) {
                                if(frameworkOutput.linesOfCode > 0){
                                    framework.linesOfCode += frameworkOutput.linesOfCode;
                                }
                                framework.numberOfCommits += frameworkOutput.numberOfCommits;
                            }
                        }
                    }
                }
            }

            languages.push(language);
        }
        const projectSummary: IGitProjectSummary = {
            totalOutput: languages,
            projectsOutput: projectOutputs
        };

        return projectSummary;
    }
}