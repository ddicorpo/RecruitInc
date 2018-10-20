import {AbstractFrameworkMatcher} from "../AbstractFrameworkMatcher";
import {IMatcherConfig} from "../../data-model/matcher-model/IMatcherConfig";
import {typescriptConfig} from "../../data-model/matcher-config/Javascript/TypescriptConfig";
import {IGitProjectOutput} from "../../data-model/output-model/IGitProjectOutput";
import {IGitProjectInput} from "../../data-model/input-model/IGitProjectInput";

export class ReactMatcher extends AbstractFrameworkMatcher {

    private sourceFileToParse: string = "package.json";
    private result: IGitProjectOutput;

    public constructor(projectsInput: IGitProjectInput, matchingConfig: IMatcherConfig = typescriptConfig) {

        super(projectsInput, matchingConfig);
        //this.reactPattern = matchingExtensions[0];
    }
    private sourceFolder = "src/";
    private allJavascriptExtensions = ["js", "ts"];

}
