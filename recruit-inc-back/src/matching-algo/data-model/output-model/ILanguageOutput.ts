import { IFrameworkOutput} from './IFrameworkOutput'
export interface ILanguageOutput{
    languageOrFramework: string,
    lineOfCode: number,
    numberOfCommits: number,
    frameworks: IFrameworkOutput[]
}