import * as React from 'react';
import { Logger } from '../../Logger';
import { IResultSection } from "../../model/QuestionnaireCandidate/IResultSection";
import { IQuestionnaireCandidate } from "../../model/QuestionnaireCandidate/IQuestionnaireCandidate";

export interface IResultCardProps {
    userInfo: IQuestionnaireCandidate;
    resultsInfo: IResultSection;
}

interface IResultsFlattenedInfo {
    language: string;
    total: number;
}

export class ResultsCard extends React.Component<IResultCardProps, any> {
    private flatResults: IResultsFlattenedInfo[];
    private logger: Logger;

    constructor(props: any) {
        super(props);
        this.handleCollapse = this.handleCollapse.bind(this);
        this.initializeResultCollapsedO = this.initializeResultCollapsedO.bind(this);
        this.state = {
            isCollapsed: true,
            isResultCollapsed: this.initializeResultCollapsedO(),
        };
        this.logger = new Logger();
    }

    private initializeResultCollapsedO(): boolean[] {
        return new Array(this.flatResults.length).fill(
            true,
            0,
            this.flatResults.length
        );
    }

    private handleCollapse() {
        this.logger.info({
            class: 'ResultsCard',
            method: 'handleCollapse',
            action: 'Collapsing the card corresponding to a user.',
            params: {},
            });
        this.setState({
            isCollapsed: !this.state.isCollapsed
        })
    }

}