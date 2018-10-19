import {AbstractMatcher} from "./AbstractMatcher";
import { IDataEntry } from "../data-model/input-model/IDataEntry";
import { IGitProjectOutput } from "../data-model/output-model/IGitProjectOutput";
export class ReactMatcher extends AbstractMatcher {

    public constructor(projectsInput: IDataEntry){
        super(projectsInput);

    }

    public execute(): IGitProjectOutput {
        return null; 
    }
}
