import { IDataEntry} from "../data-model/input-model/IDataEntry";
import { IGitProjectOutput } from "../data-model/output-model/IGitProjectOutput";
import {ISourceFileMapEntry} from "./ReactMatcher";
import { Technologies } from "../data-model/output-model/Technologies";
export abstract class AbstractMatcher {

    protected projectsInput : IDataEntry;
    protected targetTechnolgie : Technologies;
    public constructor(projectsInput: IDataEntry, targetTechnologie : Technologies ){
        this.projectsInput = projectsInput;
        this.targetTechnolgie = targetTechnologie;
    }

    public abstract execute(): IGitProjectOutput;

    protected abstract sourceFilePathToParse(): ISourceFileMapEntry;

    public abstract isTechnologieFound(): boolean;
}
