import {AbstractLanguageMatcher} from "../matcher/AbstractLanguageMatcher";
import {IGitProjectOutput} from "../data-model/output-model/IGitProjectOutput";
import {IDataEntry} from "../data-model/input-model/IDataEntry";
import {IGitProjectInput} from "../data-model/input-model/IGitProjectInput";
import {ILanguageOutput} from "../data-model/output-model/ILanguageOutput";
import {allMatchers} from "./AllMatchers";

export class MatcherClient {


    private languageMatchers: AbstractLanguageMatcher[] = [];
    private dataEntry: IDataEntry;

    public constructor(dataEntry: IDataEntry, languageMatchers: AbstractLanguageMatcher[] = allMatchers){
        this.dataEntry = dataEntry;
        this.languageMatchers = allMatchers;
    }

    public execute(): IGitProjectOutput[] {
        const allProjects: IGitProjectInput[] = this.dataEntry.projectInputs;

        const projectOutputs: IGitProjectOutput[] = [];
        for (const project of allProjects) {
            //TODO: Add Logger Feedback here
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
            //TODO: Add Logger feedback here

        }
        return projectOutputs;
    }
}