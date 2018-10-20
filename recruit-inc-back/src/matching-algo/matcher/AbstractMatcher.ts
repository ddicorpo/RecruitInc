import { IGitProjectOutput } from "../data-model/output-model/IGitProjectOutput";
import { Technologies } from "../data-model/output-model/Technologies";
import {IGitProjectInput} from "../data-model/input-model/IGitProjectInput";
import {ITargetMatcher} from "../data-model/matcher-model/ITargetMatcher";
export abstract class AbstractMatcher {

    protected matchingTargets: ITargetMatcher[];
    protected technology : Technologies;
    protected projectsInput : IGitProjectInput;
    protected matchingExtensions: string[];

    public constructor(projectsInput: IGitProjectInput, matchingTargets: ITargetMatcher[], targetTechnology : Technologies, matchingExtensions: string[]){
        this.projectsInput = projectsInput;
        this.technology = targetTechnology;
        this.matchingExtensions = matchingExtensions;
        this.matchingTargets = matchingTargets
    }

    public execute(): IGitProjectOutput{
        console.log('I am executing....');
        return new class implements IGitProjectOutput {
            languageOutput: [];
            projectName: "empty";
        }
    }

}
