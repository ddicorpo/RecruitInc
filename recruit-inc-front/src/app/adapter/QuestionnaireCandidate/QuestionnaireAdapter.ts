import { IQuestionnaireCandidate } from "../../model/QuestionnaireCandidate/IQuestionnaireCandidate";
import { IResultSection } from "../../model/QuestionnaireCandidate/IResultSection";

export class QuestionnaireAdapter{
    constructor() {}

    public adapt(result): IQuestionnaireCandidate[] {
        let questionnaireCandidates: IQuestionnaireCandidate[] = [];
        let num: number;
        for (num = 0; num < result.length; num++) {
            try{
                let resultsSection : IResultSection[] = [];
                for(let index = 0; index < result[num].group.length; index++){
                    let rSection : IResultSection = {
                        section: result[num].group[index].type,
                        score: result[num].group[index].total
                    }
                    resultsSection.push(rSection)
                }
                let questionResult : IQuestionnaireCandidate = {
                    username: result[num].fullName,
                    totalResult: result[num].total,
                    resultSection: resultsSection
                }

                questionnaireCandidates.push(questionResult);
            } catch (Exception) {
                console.log("can't adapt user " + result[num].platformUsername);
            }
        }

        return questionnaireCandidates;
    }
}