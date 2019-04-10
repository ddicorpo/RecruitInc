import { IResultSection } from "./IResultSection";

export interface IQuestionnaireCandidate{
    username: string;
    totalResult: number;
    resultSection: IResultSection[];
}
