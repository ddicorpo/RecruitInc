import * as React from 'react';
import CandidateCard, {ICardProps, IGithubUserInformation} from "../components/CandidateCard";
import {IGitProjectSummary} from "../../../../recruit-inc-back/src/matching-algo/data-model/output-model/IGitProjectSummary";

const GitProjectSummary = require("../../../GitProjectSummary.json");
class CandidateSearch extends React.Component<any, any> {
    private gitProjectSummary: IGitProjectSummary;
    private gitUserInfo: IGithubUserInformation;
    private gitUserInfo1: IGithubUserInformation;
    private gitUserInfo2: IGithubUserInformation;
    private gitUserInfo3: IGithubUserInformation;
    private gitUserInfo4: IGithubUserInformation;
    private gitUserInfo5: IGithubUserInformation;

    private cardProps: ICardProps[];

    constructor(props: any) {
        super(props);
        this.gitProjectSummary = GitProjectSummary;

        this.gitUserInfo = {
            username: "lydiahallie",
            email: "lydiajuliettehallie@gmail.com",
            profileLink: "https://github.com/lydiahallie"
        };

        this.gitUserInfo1 = {
            username: "lydiahallie1",
            email: "lydiajuliettehallie@gmail.com",
            profileLink: "https://github.com/lydiahallie"
        };

        this.gitUserInfo2 = {
            username: "lydiahallie2",
            email: "lydiajuliettehallie@gmail.com",
            profileLink: "https://github.com/lydiahallie"
        };

        this.gitUserInfo3 = {
            username: "lydiahallie3",
            email: "lydiajuliettehallie@gmail.com",
            profileLink: "https://github.com/lydiahallie"
        };

        this.gitUserInfo4 = {
            username: "lydiahallie4",
            email: "lydiajuliettehallie@gmail.com",
            profileLink: "https://github.com/lydiahallie"
        };

        this.gitUserInfo5 = {
            username: "lydiahallie5",
            email: "lydiajuliettehallie@gmail.com",
            profileLink: "https://github.com/lydiahallie"
        };

        this.cardProps = [
            {
                userInfo: this.gitUserInfo,
                projectInfo: this.gitProjectSummary
            },
            {
                userInfo: this.gitUserInfo1,
                projectInfo: this.gitProjectSummary
            },
            {
                userInfo: this.gitUserInfo2,
                projectInfo: this.gitProjectSummary
            },
            {
                userInfo: this.gitUserInfo3,
                projectInfo: this.gitProjectSummary
            },
            {
                userInfo: this.gitUserInfo4,
                projectInfo: this.gitProjectSummary
            },
            {
                userInfo: this.gitUserInfo5,
                projectInfo: this.gitProjectSummary
            }
        ]
    }

    renderCards(): JSX.Element[] {
        const array: JSX.Element[] = [];
        for (let cardProp of this.cardProps) {
            console.log(cardProp.userInfo);
            array.push(
                <CandidateCard
                    userInfo = {cardProp.userInfo}
                    projectInfo = {cardProp.projectInfo}
                />
            );
        }
        return array;
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

                    {this.renderCards()}

                </div>

        );
    }
}

export default CandidateSearch;
