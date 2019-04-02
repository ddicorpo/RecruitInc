import * as React from 'react';
// import Select from 'react-select';
import { ObtainQuestionnaireCandidates } from "../services/ObtainQuestionnaireCandidates";
import { IQuestionnaireCandidate } from "../model/QuestionnaireCandidate/IQuestionnaireCandidate";
import { QuestionnaireAdapter } from "../adapter/QuestionnaireCandidate/QuestionnaireAdapter";
// import Pagination from 'react-js-pagination';
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
        this.setState({activePage: page});

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
            <div className="container-fluid">
                <div className="page-header">
                    <h2 className="header-title">Questionnaire Results</h2>
                </div>
                <div className="card">
                    <div className="card-header border bottom">
                        <h4 className="card-title">Search Candidate</h4>
                    </div>
                    <div className="card-body">
                        <div className="row m-t-30">
                            <div className="col-md-6">
                                <div className="p-h-10">
                                    <div className="form-group">
                                        <label className="control-label">&nbsp;</label>
                                        <input type="text" className="form-control" placeholder="Search..."/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="p-h-10">
                                    <div className="form-group">
                                        <label className="control-label">&nbsp;</label>
                                        <button
                                            id="save"
                                            className="btn btn-success form-control super-button"
                                            type="button"
                                        >
                                            Search
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header border bottom">
                        <h4 className="card-title">Results</h4>
                    </div>
                </div>
            </div>

        )
    }
};

export default CandidateQuestionnaire;