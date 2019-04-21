import * as React from 'react';
import CandidateCard, { ICardProps } from '../components/CandidateCard';
import { ICandidate } from '../model/Candidate/ICandidate';
import { CandidateAdapter } from '../adapter/CandidateAdapter';
import { ObtainCandidatesByUser } from '../services/ObtainCandidatesByUser';

class CandidateSearchByUser extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
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

  getCandidates = (username: string) => {
    let localCandidates: ICandidate[] = [];
    let candidatesService: ObtainCandidatesByUser = new ObtainCandidatesByUser();

    candidatesService.setUsername(username);

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
      this.getCandidates(username);
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
          <h2 className="header-title">Candidate Search By User</h2>
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
        </div>
      </div>
    );
  }
}

export default CandidateSearchByUser;
