import * as React from 'react';
import { Logger } from '../Logger';
import { IProjectSummary } from '../model/Candidate/IProjectSummary';
import { ICandidate } from '../model/Candidate/ICandidate';
import { ILanguageOutput } from '../model/Candidate/ILanguageOutput';
import { IGitProjectOutput } from '../model/Candidate/IGitProjectOuput';
import { IGitProjectInput } from '../model/Candidate/IGitProjectInput';

export interface ICardProps {
  userInfo: ICandidate;
  projectInfo: IProjectSummary;
}
interface IGithubFlattenedInfo {
  language: string;
  commits: number;
  linesOfCode: number;
}

interface IGithubProjectFlattenedInfo {
  project: string;
  projectUrl: string;
  info: IGithubFlattenedInfo[];
}

export class CandidateCard extends React.Component<ICardProps, any> {
  private flatProjectsOutput: IGithubProjectFlattenedInfo[];
  private flatTotal: IGithubFlattenedInfo[];
  private logger: Logger;

  constructor(props: any) {
    super(props);
    this.handleCollapse = this.handleCollapse.bind(this);
    this.initializeProjectCollapsed = this.initializeProjectCollapsed.bind(
      this
    );
    this.handleProjectCollapse = this.handleProjectCollapse.bind(this);
    this.processGithubInfo();
    this.state = {
      isCollapsed: true,
      isRepository: false,
      isSummary: true,
      isProjectCollapsed: this.initializeProjectCollapsed(),
    };
    this.logger = new Logger();
  }

  private initializeProjectCollapsed(): boolean[] {
    return new Array(this.flatProjectsOutput.length).fill(
      true,
      0,
      this.flatProjectsOutput.length
    );
  }

  private handleProjectCollapse(index: number) {
    const newArray: boolean[] = this.state.isProjectCollapsed.slice();
    newArray[index] = !newArray[index];
    // When we have real loaded data that comes from the backend, we should also log which user and which repo
    // were involved
    this.logger.info({
      class: 'CandidateCard',
      method: 'handleProjectCollapse',
      action: 'Collapsing the project corresponding to the index value.',
      params: { index },
    });
    this.setState({
      isProjectCollapsed: newArray,
    });
  }

  private handleCollapse() {
    // When we have real loaded data that comes from the backend, we should also log which user was involved
    this.logger.info({
      class: 'CandidateCard',
      method: 'handleCollapse',
      action: 'Collapsing the card corresponding to a user.',
      params: {},
    });
    this.setState({
      isCollapsed: !this.state.isCollapsed,
      isProjectCollapsed: this.initializeProjectCollapsed(),
      isRepository: false,
      isSummary: true,
    });
  }

  private handleRepositoryClick() {
    // When we have real loaded data that comes from the backend, we should also log which user was involved
    this.logger.info({
      class: 'CandidateCard',
      method: 'handleRepositoryClick',
      action: 'Clicked on the repository button for a user',
      params: {},
    });
    this.setState({
      isRepository: true,
      isSummary: false,
    });
  }

  private handleSummaryClick() {
    // When we have real loaded data that comes from the backend, we should also log which user was involved
    this.logger.info({
      class: 'CandidateCard',
      method: 'handleSummaryClick',
      action: 'Clicked on the summary button for a user',
      params: {},
    });
    this.setState({
      isRepository: false,
      isSummary: true,
    });
  }

  private processGithubInfo() {
    this.flatProjectsOutput = this.flattenProjectOutput(
      this.props.projectInfo.projectOutput,
      this.props.userInfo.projectInputs
    );
    this.flatTotal = this.flattenGithubLanguages(
      this.props.projectInfo.totalOutput
    );
  }

  private flattenProjectOutput(
    githubProjects: IGitProjectOutput[],
    gitProjectInputs: IGitProjectInput[]
  ): IGithubProjectFlattenedInfo[] {
    const array: IGithubProjectFlattenedInfo[] = [];

    for (let project of githubProjects) {
      let projectOwner: string = 'empty';
      // Grab the owner of the project
      //TODO: Refactor to reduce the Big-O
      for (let projInput of gitProjectInputs) {
        if (projInput.projectName === project.projectName) {
          projectOwner = projInput.owner;
        }
      }

      let projectUrlBuilder: string = 'empty';
      if (projectOwner != 'empty') {
        projectUrlBuilder =
          'https://www.github.com/' + projectOwner + '/' + project.projectName;
      }
      array.push({
        project: project.projectName,
        info: this.flattenGithubLanguages(project.languageOutput),
        projectUrl: projectUrlBuilder,
      });
    }
    return array;
  }

  private flattenGithubLanguages(
    languageOutput: ILanguageOutput[]
  ): IGithubFlattenedInfo[] {
    const array: IGithubFlattenedInfo[] = [];

    for (let output of languageOutput) {
      array.push({
        language: output.languageOrFramework,
        commits: output.numberOfCommits,
        linesOfCode: output.linesOfCode,
      });
      for (let framework of output.frameworks) {
        array.push({
          language: '    ' + framework.technologyName,
          commits: framework.numberOfCommits,
          linesOfCode: framework.linesOfCode,
        });
      }
    }
    return array;
  }

  private renderGithubTable(
    flatGithubInfo: IGithubFlattenedInfo[]
  ): JSX.Element {
    const tableContent: JSX.Element[] = [];

    for (const language of flatGithubInfo) {
      tableContent.push(
        <tr>
          {<td>{language.language}</td>}
          {<td>{language.commits}</td>}
          {<td>{language.linesOfCode}</td>}
        </tr>
      );
    }

    return (
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th scope="col">Languages/Framework</th>
            <th scope="col">Commits</th>
            <th scope="col">Lines of code</th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    );
  }

  private renderRepositoryCard(
    projectFlattenedInfo: IGithubProjectFlattenedInfo,
    index: number
  ): JSX.Element {
    const baseChevronClass: string = 'text-gray card-collapse-btn';
    const chevronClass: string = this.state.isProjectCollapsed[index]
      ? baseChevronClass + ' active'
      : baseChevronClass;

    const display: React.CSSProperties = this.state.isProjectCollapsed[index]
      ? {
          display: 'none',
        }
      : {};

    return (
      <div className="card">
        <div className="card-header border bottom">
          <h5 className="card-title">
            <a href={projectFlattenedInfo.projectUrl} target="_blank">
              {projectFlattenedInfo.project}
            </a>
          </h5>
          <div className="card-toolbar">
            <ul>
              <li>
                <a
                  className={chevronClass}
                  data-toggle="card-collapse"
                  onClick={() => this.handleProjectCollapse(index)}
                >
                  <i className="mdi mdi-chevron-down font-size-20" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="card-collapsible" style={display}>
          <div className="card-body">
            {this.renderGithubTable(projectFlattenedInfo.info)}
          </div>
        </div>
      </div>
    );
  }

  private renderSummary(): JSX.Element {
    return this.renderGithubTable(this.flatTotal);
  }

  private renderRepositories(): JSX.Element {
    const cards: JSX.Element[] = [];
    let i: number = 0;
    for (const project of this.flatProjectsOutput) {
      cards.push(this.renderRepositoryCard(project, i));
      ++i;
    }
    return <div>{cards}</div>;
  }

  private renderButtons(): JSX.Element {
    return (
      <span>
        <button
          className="col-md-4 btn btn-primary btn-rounded"
          onClick={() => this.handleSummaryClick()}
        >
          Summary
        </button>
        <button
          className="col-md-4 btn btn-info btn-rounded"
          onClick={() => this.handleRepositoryClick()}
        >
          Repositories
        </button>
      </span>
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
    const summary = this.state.isSummary ? this.renderSummary() : '';
    const repositories = this.state.isRepository
      ? this.renderRepositories()
      : '';
    return (
      <div className="card">
        <div className="card-header border bottom">
          <h4 className="card-title">
            <a href={this.props.userInfo.profileLink} target="_blank">
              {this.props.userInfo.username}
            </a>
          </h4>
          <div className="card-toolbar">
            <ul>
              <li>
                <a
                  href={'mailto:' + this.props.userInfo.email}
                  className="mdi mdi-email"
                />
              </li>
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
            {this.renderButtons()}
            {summary}
            {repositories}
          </div>
        </div>
      </div>
    );
  }
}

export default CandidateCard;
