import * as React from 'react';
import { Pages } from '../pages/Pages';
import CandidateSearch from '../pages/CandidateSearch';
import LocationWatchList from '../pages/LocationWatchlist';
import RatioFiltering from '../pages/RatioFiltering';

class PageContainer extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  renderSwitch(page: string) {
    switch (page) {
      case Pages.CANDIDATE_SEARCH: {
        return <CandidateSearch />;
      }

      case Pages.LOCATION_WATCHLIST: {
        return <LocationWatchList />;
      }

      case Pages.Ratio_Filtering: {
        return <RatioFiltering />;
      }

      default: {
        return <div />;
      }
    }
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
