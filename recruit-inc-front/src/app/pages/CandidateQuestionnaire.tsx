import * as React from 'react';
import { ObtainQuestionnaireCandidates } from "../services/ObtainQuestionnaireCandidates";
import { IQuestionnaireCandidate } from "../model/QuestionnaireCandidate/IQuestionnaireCandidate";
import { QuestionnaireAdapter } from "../adapter/QuestionnaireCandidate/QuestionnaireAdapter";

// import { Logger } from "../Logger";

class CandidateQuestionnaire extends React.Component<any, any> {
    // private logger: Logger;

    constructor(props: any) {
        super(props);
        // this.logger = new Logger();
    };

    getQuestionnaireCandidates = (isSearchFilter: boolean, page: number) => {
        let localQuestionnaireCandidates: IQuestionnaireCandidate[] = [];
        let questionnaireService: ObtainQuestionnaireCandidates = new ObtainQuestionnaireCandidates();

        questionnaireService.changePage(page);
        this.setState({ activePage: page });

        if (isSearchFilter) {
            console.log(this.state.selectedTechOptions);
            questionnaireService.applyFilters(this.state.selectedTechOptions);
        }

        questionnaireService
            .execute()
            .then(result => {
                questionnaireService.logActionCompleted(questionnaireService.serviceName);
                let adapter: QuestionnaireAdapter = new QuestionnaireAdapter();
                localQuestionnaireCandidates = adapter.adapt(result.data);
                this.setState({
                    candidates: localQuestionnaireCandidates,
                });
            })
            .catch(error => {
                questionnaireService.logActionFailure(
                    questionnaireService.serviceName,
                    error,
                    error
                );
            });
    };

    render() {
        return (
            <h1>Hello World</h1>
        )
    }
};

export default CandidateQuestionnaire;