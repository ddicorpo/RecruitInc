import * as React from 'react';
import CandidateCard, { ICardProps } from '../components/CandidateCard';
import Select from 'react-select';
import { ActionMeta, ValueType } from 'react-select/lib/types';
import { Logger } from '../Logger';
import { ICandidate } from '../model/Candidate/ICandidate';
import { IOptionsBox } from '../model/IOptionsBox';
import { CandidateAdapter } from '../adapter/CandidateAdapter';
import { ObtainCandidates } from '../services/ObtainCandidates';
import { ObtainLocations } from '../services/ObtainLocations';
import { ObtainTechnologies } from '../services/ObtainTechnologies';
import Pagination from 'react-js-pagination';

class CandidateSearch extends React.Component<any, any> {
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
      isLoaded: false,
      isRankedActive: this.props.isRanking,
      error: undefined,
      selectedTechOption: [],
    };
  }

  private renderCards(): JSX.Element[] {
    const array: JSX.Element[] = [];
    let index: number;
    for (index = 0; index < this.state.candidates.length; index++) {
      let tmpProps: ICardProps = {
        userInfo: this.state.candidates[index],
        projectInfo: this.state.candidates[index].projectSummary,
      };
      array.push(
        <CandidateCard
          key={tmpProps.userInfo.username}
          userInfo={tmpProps.userInfo}
          projectInfo={tmpProps.projectInfo}
        />
      );
    }
    if (this.state.candidates.length < 1) {
      array.push(<div>No result</div>);
    }
    return array;
  }

  private loadSupportedTechnologies(): void {
    const techService: ObtainTechnologies = new ObtainTechnologies();

    techService.execute().then(
      result => {
        let techFromConfig: IOptionsBox[] = [];
        for (let technology in result.data) {
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
    const locationService: ObtainLocations = new ObtainLocations();
    locationService.execute().then(
      result => {
        let locationFromSource: IOptionsBox[] = [];
        for (let location in result.data) {
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
    this.getCandidates(true, pageNumber);
    this.setState({ activePage: pageNumber });

    this.logger.info({
      class: 'CandidateSearch',
      method: 'handlePageChange',
      action: 'Changing the page to ' + pageNumber,
      params: { pageNumber },
    });

    this.setState({ activePage: pageNumber });

    this.render();
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

  getCandidates = (isSearchFilter: boolean, page: number) => {
    let localCandidates: ICandidate[] = [];
    let candidatesService: ObtainCandidates = new ObtainCandidates();

    candidatesService.changePage(page);
    this.setState({ activePage: page });

    if (isSearchFilter) {
      console.log(this.state.selectedTechOptions);
      candidatesService.applyFilters(this.state.selectedTechOptions);
    }

    candidatesService
      .execute()
      .then(result => {
        candidatesService.logActionCompleted(candidatesService.serviceName);
        let adapter: CandidateAdapter = new CandidateAdapter();
        localCandidates = adapter.adapt(result.data);
        this.setState({
          candidates: localCandidates,
        });
      })
      .catch(error => {
        candidatesService.logActionFailure(
          candidatesService.serviceName,
          error,
          error
        );
      });
  };

  handleSearchClick = () => {
    const page: number = 1;
    this.getCandidates(true, page);
    this.render();
  };

  handleLoadClick = () => {
    const page: number = 1;
    this.getCandidates(false, page);
    this.render();
  };

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
              {this.state.isRankedActive ? <p> active </p> : <p> not active</p>}
              <div className="col-md-4">
                <div className="p-h-10">
                  <div className="form-group">
                    <label className="control-label">&nbsp;</label>
                    <button
                      id="save"
                      className="btn btn-success form-control super-button"
                      type="button"
                      onClick={this.handleSearchClick}
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
            // Would be good to do an initial call to see how many items there is
            itemsCountPerPage={2}
            totalItemsCount={100}
            pageRangeDisplayed={3}
            onChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default CandidateSearch;
