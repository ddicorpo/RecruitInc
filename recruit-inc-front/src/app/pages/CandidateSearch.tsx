import * as React from 'react';
import CandidateCard, {
  ICardProps,
  IGithubUserInformation,
} from '../components/CandidateCard';
import { IGitProjectSummary } from '../../../../recruit-inc-back/src/matching-algo/data-model/output-model/IGitProjectSummary';
import Pagination from 'react-js-pagination';
import Select from 'react-select';
import { ActionMeta, ValueType } from 'react-select/lib/types';
import { Logger } from '../Logger';
// import { object, array } from 'prop-types';

const GitProjectSummary: any = require('../../../GitProjectSummary.json');
const BackEndAddress: string =
  process.env.BACK_END_ADDRESS + ':' + process.env.BACK_END_PORT;

interface IOptions {
  value: string;
  label: string;
}

class CandidateSearch extends React.Component<any, any> {
  private gitProjectSummary: IGitProjectSummary;
  private gitUserInfo: IGithubUserInformation;

  private cardProps: ICardProps[];
  private logger: Logger;

  constructor(props: any) {
    super(props);
    this.logger = new Logger();
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.handleCityChange = this.handleCityChange.bind(this);
    this.state = {
      activePage: 1,
      selectedTechOptions: [],
      cityOption: '',
      techFromBackEnd: [],
      cities: [],
    };
    this.gitProjectSummary = GitProjectSummary;

    this.gitUserInfo = {
      username: 'lydiahallie',
      email: 'lydiajuliettehallie@gmail.com',
      profileLink: 'https://github.com/lydiahallie',
    };

    this.cardProps = [
      {
        userInfo: this.gitUserInfo,
        projectInfo: this.gitProjectSummary,
      },
    ];
  }

  private renderCards(): JSX.Element[] {
    const array: JSX.Element[] = [];
    for (let cardProp of this.cardProps) {
      array.push(
        <CandidateCard
          userInfo={cardProp.userInfo}
          projectInfo={cardProp.projectInfo}
        />
      );
    }
    if (this.cardProps.length < 1) {
      array.push(<div>No result</div>);
    }
    return array;
  }

  private loadSupportedTechnologies(): void {
    const obtainTechSource: string =
      'http://' + BackEndAddress + '/api/supportedTech';
    fetch(obtainTechSource)
      .then(response => response.json())
      .then(
        result => {
          let techFromConfig: IOptions[] = [];
          for (let technology in result) {
            techFromConfig.push({ value: technology, label: technology });
          }
          this.setState({
            isLoaded: false,
            techSelect: techFromConfig,
          });
        },
        error => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }

  private loadSupportedLocation(): void {
    const obtainLocationSource: string =
      'http://' + BackEndAddress + '/api/supportedLocation';
    fetch(obtainLocationSource)
      .then(response => response.json())
      .then(
        result => {
          let locationFromSource: IOptions[] = [];
          for (let location in result) {
            locationFromSource.push({ value: location, label: location });
          }
          this.setState({
            isLoaded: false,
            cities: locationFromSource,
          });
        },
        error => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }

  handlePageChange(pageNumber: number) {
    this.logger.info({
      class: 'CandidateSearch',
      method: 'handlePageChange',
      action: 'Changing the page to ' + pageNumber,
      params: { pageNumber },
    });
    this.setState({ activePage: pageNumber });
  }

  handleLanguageChange(value: ValueType<IOptions>, action: ActionMeta): void {
    // Once we have a call to the backend, we'll capture this through the button press
    this.setState({
      selectedTechOptions: value,
    });
  }

  handleCityChange(value: ValueType<IOptions>, action: ActionMeta): void {
    // Once we have a call to the backend, we'll capture this through the button press
    this.setState({
      cityOption: value,
    });
  }
  /**
   * Function call before the render()
   */
  componentWillMount() {
    // Load our Tech from server
    this.loadSupportedTechnologies();
    this.loadSupportedLocation();
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
                      options={this.state.techSelect}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-h-10">
                  <div className="form-group">
                    <label className="control-label">City Search</label>
                    {console.log(this.state.cityOption)}
                    {console.log(this.state.cities)}
                    <Select
                      value={this.state.cityOption}
                      onChange={this.handleCityChange}
                      isSearchable={true}
                      placeholder="City"
                      options={this.state.cities}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-h-10">
                  <div className="form-group">
                    <label className="control-label">&nbsp;</label>
                    <button
                      id="save"
                      className="btn btn-success form-control"
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
          <div className="card-body">{this.renderCards()}</div>

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
