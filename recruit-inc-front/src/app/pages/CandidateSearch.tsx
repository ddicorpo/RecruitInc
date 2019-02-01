import * as React from 'react';
//import CandidateCard, { ICardProps } from '../components/CandidateCard';
//import { IGitProjectSummary } from '../../../../recruit-inc-back/src/matching-algo/data-model/output-model/IGitProjectSummary';
//import Pagination from 'react-js-pagination';
import Select from 'react-select';
import { ActionMeta, ValueType } from 'react-select/lib/types';
import { Logger } from '../Logger';
import { ICandidate } from '../model/Candidate/ICandidate';
import { IOptionsBox } from '../model/IOptionsBox';

const BackEndAddress: string =
  process.env.BACK_END_ADDRESS + ':' + process.env.BACK_END_PORT;

class CandidateSearch extends React.Component<any, any> {
  // private gitProjectSummary: IGitProjectSummary;
  // private gitUserInfo: IGithubUserInformation;

  //private cardProps: ICardProps[];
  private logger: Logger;

  constructor(props: any) {
    super(props);
    this.logger = new Logger();
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.handleCityChange = this.handleCityChange.bind(this);
    this.state = {
      activePage: 1,
      selectedTechnology: [],
      selectedLocation: '',
      techFromBackEnd: [],
      locationFromBackEnd: [],
      candidates: [],
    };
    // this.gitProjectSummary = GitProjectSummary;

    // this.gitUserInfo = {
    //   username: 'lydiahallie',
    //   email: 'lydiajuliettehallie@gmail.com',
    //   profileLink: 'https://github.com/lydiahallie',
    // };

    // this.cardProps = [
    //   {
    //     userInfo: this.gitUserInfo,
    //     projectInfo: this.gitProjectSummary,
    //   },
    // ];
  }

  private renderCards(): JSX.Element[] {
    const array: JSX.Element[] = [];
    this.state.candidates.forEach(function (candidate) {
      array.push(
          <tr>
            <td>{candidate.username}</td>
            <td>{candidate.email}</td>
            <td>{candidate.profileLink}</td>
          </tr>
      );
    });
    if (this.state.candidates.length < 1) {
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
          let techFromConfig: IOptionsBox[] = [];
          for (let technology in result) {
            techFromConfig.push({ value: technology, label: technology });
          }
          this.setState({
            isLoaded: false,
            techFromBackEnd: techFromConfig,
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

  private loadSupportedLocations(): void {
    const obtainLocationSource: string =
      'http://' + BackEndAddress + '/api/supportedLocation';
    fetch(obtainLocationSource)
      .then(response => response.json())
      .then(
        result => {
          let locationFromSource: IOptionsBox[] = [];
          for (let location in result) {
            locationFromSource.push({ value: location, label: location });
          }
          this.setState({
            isLoaded: false,
            locationFromBackEnd: locationFromSource,
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

  handleLanguageChange(
    value: ValueType<IOptionsBox>,
    action: ActionMeta
  ): void {
    // Once we have a call to the backend, we'll capture this through the button press
    this.setState({
      selectedTechOptions: value,
    });
  }

  handleSearchClick() {
    console.log('click!');
  }

  handleLoadClick() {
    //let result = this.getCandidates();
    const apiCandidates: string = 'http://' + BackEndAddress + '/api/candidates';
    fetch(apiCandidates)
        .then(response => {
          return response.json();
        })
        .then(result => {
          console.log(result);

          let localCandidates: ICandidate[] = [];

          let num: number;
          for(num=0; num < result.length; num++){
            localCandidates.push({
              isFilter: false,
              username: result[num].platformUsername,
              profileLink: "",
              userType: "",
              email: result[num].platformEmail,
              ProjectSummary: {
                totalOutput: [],
                projectOutput: {
                  projectName: "",
                  projectUrl: "",
                  languageOutput: []
                }
              }
            });

            this.setState({
              candidates: localCandidates,
            });
            //this.render();
          }
        });
  }

  getCandidates() : any{
    const apiCandidates: string = 'http://' + BackEndAddress + '/api/candidates';
    fetch(apiCandidates)
        .then(response => {
          return response.json();
        })
        .then(result => {
          return result;
        });
  }

  handleCityChange(value: ValueType<IOptionsBox>, action: ActionMeta): void {
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
    // Load Supported Location
    this.loadSupportedLocations();

    this.handleLoadClick();
  }

  render() {
    //let isResultEmpty = this.state.candidates == undefined || this.state.candidates.length < 1;
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
                      options={this.state.techFromBackEnd}
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
                    {console.log(this.state.locationFromBackEnd)}
                    <Select
                      value={this.state.cityOption}
                      onChange={this.handleCityChange}
                      isSearchable={true}
                      placeholder="City"
                      options={this.state.locationFromBackEnd}
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
                      className="btn btn-success form-control super-button"
                      type="button"
                      onClick={this.handleSearchClick}>
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
            <div className="form-group middle-man">
              <button
                id="load"
                className="btn btn-gradient-primary form-control super-button"
                type="button"
                onClick={this.handleLoadClick}
              >
                Load All
              </button>
            </div>
          <div className="card-body">
            <div className="table-overflow">
              <table id="dt-opt" className="table table-hover table-xl">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Profile Link</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderCards()}
                </tbody>
              </table>
            </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default CandidateSearch;
