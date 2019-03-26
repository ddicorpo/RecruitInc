import * as React from 'react';
import { Pages } from '../pages/Pages';
import CandidateSearch from '../pages/CandidateSearch';
import LocationWatchList from '../pages/LocationWatchlist';
import { ToggleFeature } from '../toggle-feature/ToggleFeature';

class PageContainer extends React.Component<any, any> {
  private toggles: ToggleFeature;
  constructor(props: any) {
    super(props);
  }

  renderSwitch(page: string) {
    switch (page) {
      case Pages.CANDIDATE_SEARCH: {
        return <CandidateSearch isRanking={this.toggles.isNewFeatureRollout} />;
      }

      case Pages.LOCATION_WATCHLIST: {
        return <LocationWatchList />;
      }

      default: {
        return <div />;
      }
    }
  }

  componentWillMount() {
    this.toggles = new ToggleFeature();
    this.toggles
      .retrieveToggleFeature()
      .then(v => {
        console.log('Retreive Feature toggle');
      })
      .catch(error => {
        console.log("can't get feature toggle");
      });
  }
  render() {
    return (
      <div className="page-container">
        <div className="main-content">{this.renderSwitch(this.props.page)}</div>
        <footer className="content-footer">
          <div className="footer">
            <div className="copyright">
              <span>RecruitInc © 2018. All rights reserved.</span>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default PageContainer;
