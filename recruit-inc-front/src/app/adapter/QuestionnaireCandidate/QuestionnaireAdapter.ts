import {IQuestionnaireCandidate} from "../../model/QuestionnaireCandidate/IQuestionnaireCandidate";

export class QuestionnaireAdapter{
    constructor() {}

    public adapt(result): IQuestionnaireCandidate[] {
        let questionnaireCandidates: IQuestionnaireCandidate[] = [];
        let num: number;

        for (num = 0; num < result.length; num++) {
            try{

            } catch (Exception) {
                console.log("can't adapt user " + result[num].platformUsername);
            }
        }

        return questionnaireCandidates;
    }
}