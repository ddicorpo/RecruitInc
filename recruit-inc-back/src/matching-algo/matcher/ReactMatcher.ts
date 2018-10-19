import {AbstractMatcher} from "./AbstractMatcher";
import { IDataEntry } from "../data-model/input-model/IDataEntry";
import { IGitProjectOutput } from "../data-model/output-model/IGitProjectOutput";
import {IGitProjectInput} from "../data-model/input-model/IGitProjectInput";
import {FilenameExtractor} from "../../util/FilenameExtractor";

export interface ISourceFileMapEntry {
    [key: string]: string
}

export class ReactMatcher extends AbstractMatcher {

    private sourceFileToParse = "package.json";

    public constructor(projectsInput: IDataEntry){
        super(projectsInput);

    }

    public execute(): IGitProjectOutput {
        return null; 
    }

    protected sourceFilePathToParse(): ISourceFileMapEntry[] {
        const allProjects: IGitProjectInput[] = this.projectsInput.projectInputs;

        for (const project of allProjects) {
            const projectName: string = project.projectName;

            const filePaths: string[] = project.downloadedSourceFile;

            for (const filePath of filePaths) {
                const filename: string = FilenameExtractor.extract(filePath);

            }




        }


        return null;
    }

}
