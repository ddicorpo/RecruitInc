import {AbstractMatcher} from "./AbstractMatcher";
import { IDataEntry } from "../data-model/input-model/IDataEntry";
import { IGitProjectOutput } from "../data-model/output-model/IGitProjectOutput";
import {IGitProjectInput} from "../data-model/input-model/IGitProjectInput";
import {FilenameExtractor} from "../../util/FilenameExtractor";
import { Technologies } from "../data-model/output-model/Technologies";
import * as fs from "fs";


export interface ISourceFileMapEntry {
    [key: string]: string
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

    protected sourceFilePathToParse(): ISourceFileMapEntry[] {
        const allProjects: IGitProjectInput[] = this.projectsInput.projectInputs;
        const entryList: ISourceFileMapEntry[] = [];

        for (const project of allProjects) {
            const entry: ISourceFileMapEntry = {};
            const projectName: string = project.projectName;
            const filePaths: string[] = project.downloadedSourceFile;

            for (const filePath of filePaths) {
                const filename: string = FilenameExtractor.extract(filePath);

                const isFilenameMatchingFileToParse: boolean = filename === this.sourceFileToParse;

                if (isFilenameMatchingFileToParse) {
                    entry[projectName] = filePath;
                    entryList.push(entry);
                }
            }
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
