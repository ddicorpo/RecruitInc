import { IDataEntry} from "../data-model/input-model/IDataEntry";
import { IGitProjectOutput } from "../data-model/output-model/IGitProjectOutput";
import {IProcessedSourceFile} from "./ReactMatcher";
import { Technologies } from "../data-model/output-model/Technologies";
import {IGitProjectInput} from "../data-model/input-model/IGitProjectInput";
export abstract class AbstractMatcher {

    protected projectsInput : IDataEntry;
    protected targetTechnolgy : Technologies;
    public constructor(projectsInput: IDataEntry, targetTechnologie : Technologies ){
        this.projectsInput = projectsInput;
        this.targetTechnolgy = targetTechnologie;
    }

    public abstract execute(): IGitProjectOutput[];

    protected abstract sourceFilePathToParse(project: IGitProjectInput): IProcessedSourceFile[]

    public abstract isTechnologyFound(filetext: string): boolean;
}
