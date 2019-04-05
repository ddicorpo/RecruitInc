import * as React from 'react';
import { Logger } from '../../Logger';
import { IQuestionnaireCandidate } from "../../model/QuestionnaireCandidate/IQuestionnaireCandidate";

export interface QuestionnaireDataProps {
    userInfo : IQuestionnaireCandidate
}

export class ResultsCard extends React.Component<QuestionnaireDataProps, any> {
    private logger: Logger;

    constructor(props: any) {
        super(props);
        this.handleCollapse = this.handleCollapse.bind(this);
        this.state = {
            isCollapsed: true,
            candidateResults: this.props.userInfo
        };
        this.logger = new Logger();
    }

    private handleCollapse() {
        
        // When we have real loaded data that comes from the backend, we should also log which user was involved
        this.logger.info({
          class: 'ResultsCard',
          method: 'handleCollapse',
          action: 'Collapsing the card corresponding to a user.',
          params: {},
        });
        this.setState({
          isCollapsed: !this.state.isCollapsed
        });
      }

      // for loop to write all items
    renderGroupItems() : JSX.Element {
        const tableContent: JSX.Element[] = [];

        for (const results of this.state.candidateResults.resultSection) {
            tableContent.push(
              <tr>
                {<td>{results.section}</td>}
                {<td>{results.score}</td>}
              </tr>
            );
          }
      
          return (
            <table className="table">
              <thead className="thead-light">
                <tr>
                  <th scope="col">Section</th>
                  <th scope="col">Score</th>
                </tr>
              </thead>
              <tbody>{tableContent}</tbody>
            </table>
          );
    }

    render() {
        const display: React.CSSProperties = this.state.isCollapsed
        ? {
            display: 'none',
            }
        : {};
        const baseChevronClass: string = 'text-gray card-collapse-btn';
        const chevronClass: string = this.state.isCollapsed
        ? baseChevronClass + ' active'
        : baseChevronClass;
        return (
            <div className="card">
            <div className="card-header border bottom">
              <h4 className="card-title">
                  {this.props.userInfo.username}, Total: {this.props.userInfo.totalResult}/15    
              </h4>
              <div className="card-toolbar">
                <ul>
                  <li>
                    <a
                      className={chevronClass}
                      data-toggle="card-collapse"
                      onClick={this.handleCollapse}
                    >
                      <i className="mdi mdi-chevron-down font-size-20" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="card-collapsible" style={display}>
              <div className="card-body">
                {this.renderGroupItems()}
              </div>
            </div>
          </div>
        );
    }

}