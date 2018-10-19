import { IFrameworkOutput} from "./IFrameworkOutput"
import { Technologies } from "./Technologies"
export interface ILanguageOutput{
    languageOrFramework: Technologies,
    lineOfCode: number,
    numberOfCommits: number,
    frameworks: IFrameworkOutput[]
}