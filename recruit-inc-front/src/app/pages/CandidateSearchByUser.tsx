import * as React from 'react';
import CandidateCard, { ICardProps } from '../components/CandidateCard';
import { Logger } from '../Logger';
import { ICandidate } from '../model/Candidate/ICandidate';
import { CandidateAdapter } from '../adapter/CandidateAdapter';
import { ObtainCandidates } from '../services/ObtainCandidates';
import Pagination from 'react-js-pagination';
//import { ObtainFilteredCandidates } from '../services/ObtainFilteredCandidates';

class CandidateSearchByUser extends React.Component<any, any> {
  private logger: Logger;

  constructor(props: any) {
    super(props);
    this.logger = new Logger();
    this.state = {
      username: '',
      activePage: 1,
      candidates: [],
      isLoaded: false,
      error: undefined,
      isRankEnabled: false,
      rankedOption: [],
    };
    //We don't need bind if we use event... check handleRankChange
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
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

  handlePageChange(pageNumber: number) {
    // if (this.state.rankChoose.value === 'sorted') {
    //   this.getSortedCandidates(true, pageNumber);
    // } else {
    //   this.getCandidates(true, pageNumber);
    // }
    //
    // this.setState({ activePage: pageNumber });
    //
    this.logger.info({
      class: 'CandidateSearchByUser',
      method: 'handlePageChange',
      action: 'Changing the page to ' + pageNumber,
      params: { pageNumber },
    });
    //
    // this.setState({ activePage: pageNumber });
    //
    // this.render();
  }

  getCandidates = (isSearchFilter: boolean, page: number) => {
    let localCandidates: ICandidate[] = [];
    let candidatesService: ObtainCandidates = new ObtainCandidates();

    candidatesService.changePage(page);
    this.setState({ activePage: page });

    if (isSearchFilter) {
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
    let username = this.state.username;
    if (username != '') {
      console.log(username);
    }
    this.render();
  };

  handleUserInput(event) {
    this.setState({ username: event.target.value });
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
                    <label className="control-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      value={this.state.username}
                      onChange={this.handleUserInput}
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

export default CandidateSearchByUser;
