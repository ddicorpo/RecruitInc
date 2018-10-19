import { IDataEntry} from "../data-model/input-model/IDataEntry";
import { IGitProjectOutput } from "../data-model/output-model/IGitProjectOutput";

export abstract class AbstractMatcher {

    protected projectsInput : IDataEntry;
    public constructor(projectsInput: IDataEntry){
        this.projectsInput = projectsInput;
    }

    public abstract execute(): IGitProjectOutput;

}
