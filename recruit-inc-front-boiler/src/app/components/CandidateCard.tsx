import * as React from 'react';
import {IGitProjectSummary} from "../../../../recruit-inc-back/src/matching-algo/data-model/output-model/IGitProjectSummary";

interface ICardProps {
    userInfo: IGithubUserInformation
    projectInfo: IGitProjectSummary
}

export interface IGithubUserInformation {
    username: string,
    profileLink: string,
    email: string,
}

class CandidateCard extends React.Component<ICardProps, any> {
    constructor(props: any) {
        super(props);
        this.handleCollapse = this.handleCollapse.bind(this);
        this.state = {
            isCollapsed: true,
        };
    }

    private handleCollapse() {
        this.setState({
            isCollapsed: !this.state.isCollapsed,
        });
    }


    render() {
        const display: React.CSSProperties = this.state.isCollapsed ? {
            display: "none",
        } : {};
        const baseChevronClass: string = "text-gray card-collapse-btn";
        const chevronClass: string = this.state.isCollapsed ? baseChevronClass + " active" : baseChevronClass;
        return (

            <div className="col-md-12">
                <div className="card">
                    <div className="card-header border bottom">
                        <h4 className="card-title">
                            <a href={this.props.userInfo.profileLink}>{this.props.userInfo.username}</a>
                        </h4>
                        <div className="card-toolbar">
                            <ul>
                                <li>
                                    <a className={chevronClass}
                                       data-toggle="card-collapse"
                                       onClick={this.handleCollapse}
                                    >
                                        <i className="mdi mdi-chevron-down font-size-20"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="card-collapsible" style={display}>
                        <div className="card-body">
                            <p>Put toy mouse in food bowl run out of litter box at full speed drool but pee in the shoe
                                purr when being pet but chew foot.</p>
                            <p>Scratch the postman wake up lick paw wake up owner meow meow lick plastic bags so cat not
                                kitten around meow all night having their mate disturbing sleeping humans.</p>
                            <p>Try to jump onto window and fall while scratching at wall ignore the squirrels, you'll
                                never catch them anyway cat snacks.</p>
                            <p>I'll sacrifice anything for my children. She keeps saying that God is going to show me a
                                sign. The… something of my ways. Wisdom? It's probably wisdom. I've got a nice hard cot
                                with his name on it. You'd do that to your own brother? </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CandidateCard;
