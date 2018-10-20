import {AbstractMatcher} from "./AbstractMatcher";
import { IDataEntry } from "../data-model/input-model/IDataEntry";
import { IGitProjectOutput } from "../data-model/output-model/IGitProjectOutput";
import {IGitProjectInput} from "../data-model/input-model/IGitProjectInput";
import {FilenameExtractor} from "../../util/FilenameExtractor";
import { Technologies } from "../data-model/output-model/Technologies";

export interface ISourceFileMapEntry {
    [key: string]: string
}

export class ReactMatcher extends AbstractMatcher {

    private sourceFileToParse = "package.json";
    public constructor(projectsInput: IDataEntry, targetTechnologie : Technologies){
        super(projectsInput, targetTechnologie);

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

    public isTechnologieFound(): boolean {
        return false;
    }

}
