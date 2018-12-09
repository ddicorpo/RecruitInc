import * as React from 'react';
import CandidateCard, {ICardProps, IGithubUserInformation} from "../components/CandidateCard";
import {IGitProjectSummary} from "../../../../recruit-inc-back/src/matching-algo/data-model/output-model/IGitProjectSummary";
import Pagination from "react-js-pagination";
import Select from "react-select";
import {Technologies} from "../../../../recruit-inc-back/src/matching-algo/data-model/output-model/Technologies";
import {ActionMeta, ValueType} from "react-select/lib/types";

const GitProjectSummary = require("../../../GitProjectSummary.json");

interface IOptions {
    value: string,
    label: string
}

class CandidateSearch extends React.Component<any, any> {
    private gitProjectSummary: IGitProjectSummary;
    private gitUserInfo: IGithubUserInformation;
    private gitUserInfo1: IGithubUserInformation;
    private gitUserInfo2: IGithubUserInformation;
    private gitUserInfo3: IGithubUserInformation;
    private gitUserInfo4: IGithubUserInformation;
    private gitUserInfo5: IGithubUserInformation;

    private cardProps: ICardProps[];
    private techSelect: IOptions[] = [];
    private cities: IOptions[] = [];

    constructor(props: any) {
        super(props);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleLanguageChange = this.handleLanguageChange.bind(this);
        this.handleCityChange = this.handleCityChange.bind(this);
        this.state = {
            activePage: 1,
            selectedTechOptions: [],
            cityOption: ""
        };
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
        ];

        const technologies: string[] = Object.keys(Technologies).map(key => Technologies[key]);


        for (const technology of technologies) {
            this.techSelect.push(
                { value: technology, label: technology }
            );
        }

        this.cities = [
            {
                value: "Montreal",
                label: "Montreal"
            },
            {
                value: "Quebec",
                label: "Quebec"
            },
            {
                value: "Laval",
                label: "Laval"
            },
            {
                value: "Montmagny",
                label: "Montmagny"
            }
        ]



    }

    private renderCards(): JSX.Element[] {
        const array: JSX.Element[] = [];
        for (let cardProp of this.cardProps) {
            array.push(
                <CandidateCard
                    userInfo = {cardProp.userInfo}
                    projectInfo = {cardProp.projectInfo}
                />
            );
        }
        if (this.cardProps.length < 1) {
            array.push(<div>No result</div>);
        }
        return array;
    }

    handlePageChange(pageNumber: number) {
        console.log(`active page is ${pageNumber}`);
        this.setState({activePage: pageNumber});
    }

    handleLanguageChange(value: ValueType<IOptions>, action: ActionMeta): void {
        this.setState({
            selectedTechOptions: value
        })
    }

    handleCityChange(value: ValueType<IOptions>, action: ActionMeta): void {
        this.setState({
            cityOption: value
        })
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
                                            <Select
                                                value={this.state.selectedTechOptions}
                                                onChange={this.handleLanguageChange}
                                                isMulti={true}
                                                isSearchable={true}
                                                placeholder="Language"
                                                options={this.techSelect}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-h-10">
                                        <div className="form-group">
                                            <label className="control-label">City Search</label>
                                            <Select
                                                value={this.state.cityOption}
                                                onChange={this.handleCityChange}
                                                isSearchable={true}
                                                placeholder="City"
                                                options={this.cities}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-h-10">
                                        <div className="form-group">
                                            <label className="control-label">&nbsp;</label>
                                            <button id="save" className="btn btn-success form-control"
                                                    type="button">Search
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
                        <div className="card-body">
                            {this.renderCards()}
                        </div>

                        <Pagination
                            activePage={this.state.activePage}
                            itemClass="page-item"
                            linkClass="page-link"
                            itemsCountPerPage={10}
                            totalItemsCount={450}
                            pageRangeDisplayed={5}
                            onChange={this.handlePageChange}
                        />
                    </div>

                </div>

        );
    }
}

export default CandidateSearch;
