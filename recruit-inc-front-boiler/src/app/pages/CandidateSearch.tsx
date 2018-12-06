import * as React from 'react';
import CandidateCard, {IGithubUserInformation} from "../components/CandidateCard";
import {IGitProjectSummary} from "../../../../recruit-inc-back/src/matching-algo/data-model/output-model/IGitProjectSummary";

const GitProjectSummary = require("../../../GitProjectSummary.json");
class CandidateSearch extends React.Component<any, any> {
    private gitProjectSummary: IGitProjectSummary;
    private gitUserInfo: IGithubUserInformation;

    constructor(props: any) {
        super(props);
        this.gitProjectSummary = GitProjectSummary;

        this.gitUserInfo = {
            username: "lydiahallie",
            email: "lydiajuliettehallie@gmail.com",
            profileLink: "https://github.com/lydiahallie"
        };


    }

    render() {
        return (
                <div className="container-fluid">
                    <div className="page-header">
                        <h2 className="header-title">Candidate Search</h2>
                    </div>
                    <div className="card">
                        <div className="card-header border bottom">
                            <h4 className="card-title">Search Filters</h4>
                        </div>
                        <div className="card-body">
                            <div className="row m-t-30">
                                <div className="col-md-4">
                                    <div className="p-h-10">
                                        <div className="form-group">
                                            <label className="control-label">Language Search</label>
                                            <input type="text" className="form-control" placeholder="Language"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-h-10">
                                        <div className="form-group">
                                            <label className="control-label">City Search</label>
                                            <input type="text" className="form-control" placeholder="City"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-h-10">
                                        <div className="form-group">
                                            <button id="save" className="btn btn-success form-control"
                                                    type="button">Search
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <CandidateCard
                        userInfo = {this.gitUserInfo}
                        projectInfo = {this.gitProjectSummary}
                    />

                </div>

        );
    }
}

export default CandidateSearch;
