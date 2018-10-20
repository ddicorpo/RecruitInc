import {AbstractMatcher} from "./AbstractMatcher";
import { IDataEntry } from "../data-model/input-model/IDataEntry";
import { IGitProjectOutput } from "../data-model/output-model/IGitProjectOutput";
import {IGitProjectInput} from "../data-model/input-model/IGitProjectInput";
import { Technologies } from "../data-model/output-model/Technologies";
import * as fs from "fs";
import {ISourceFiles} from "../data-model/input-model/ISourceFiles";


export interface ISourceFileMapEntry {
    [key: string]: ISourceFiles[]
}

export class ReactMatcher extends AbstractMatcher {

    private sourceFileToParse;
    public constructor(projectsInput: IDataEntry, targetTechnologie : Technologies,
                       sourceFileToParse : string = "package.json"){

        super(projectsInput, targetTechnologie);
        this.sourceFileToParse = sourceFileToParse;
    }

    public execute(): IGitProjectOutput {
        return null; 
    }

    protected sourceFilePathToParse(): ISourceFileMapEntry {
        const allProjects: IGitProjectInput[] = this.projectsInput.projectInputs;
        const entryList: ISourceFileMapEntry = {};

        for (const project of allProjects) {
            const projectName: string = project.projectName;
            const sourceFiles: ISourceFiles[] = project.downloadedSourceFile;

            const sourceFilesOutput: ISourceFiles[] = [];

            for (const sourceFile of sourceFiles) {
                const filename: string = sourceFile.filename;

                const isFilenameMatchingFileToParse: boolean = filename === this.sourceFileToParse;

                if (isFilenameMatchingFileToParse) {
                    sourceFilesOutput.push(sourceFile);
                }
            }
            entryList[projectName] = sourceFilesOutput;
        }
        return entryList;
    }

    protected readTargetFile(filePath: string) : string {
        try{
             let fileSync : string = fs.readFileSync(filePath,'utf8');
             return fileSync;
        }catch(exception){
            console.log("Problem while reading the file"
                + exception + "at: "  +filePath);
            return null;
        }
    }

    public isTechnologieFound(): boolean {
        return false;
    }

}
