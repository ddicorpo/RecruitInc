import * as React from 'react';
import { Pages } from '../pages/Pages';
import CandidateSearch from '../pages/CandidateSearch';
import LocationWatchList from '../pages/LocationWatchlist';
import DirectMessaging from '../pages/DirectMessaging';
import CandidateQuestionnaire from '../pages/CandidateQuestionnaire';
import { ToggleFeature } from '../toggle-feature/ToggleFeature';
import { Logger } from '../Logger';
import CandidateSearchByUser from '../pages/CandidateSearchByUser';

class PageContainer extends React.Component<any, any> {
  private toggles: ToggleFeature;
  private logger: Logger;
  constructor(props: any) {
    super(props);
    this.logger = new Logger();
    this.state = {
      isRankingActive: false,
    };
  }

  renderSwitch(page: string) {
    const isRankActive: boolean = this.state.isRankingActive;
    switch (page) {
      case Pages.CANDIDATE_SEARCH: {
        return <CandidateSearch isRanking={isRankActive} />;
      }

      case Pages.CANDIDATE_SEARCH_BY_USER: {
        return <CandidateSearchByUser />;
      }

      case Pages.LOCATION_WATCHLIST: {
        return <LocationWatchList />;
      }

      case Pages.Direct_Messaging: {
        return (
          <DirectMessaging appkey="wmfGqY" token="TypeScriptReactExample" />
        );
      }

      case Pages.CANDIDATE_QUESTIONNAIRE: {
        return <CandidateQuestionnaire />;
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
        const active: boolean = this.toggles.isNewFeatureRollout();
        this.setState({
          isRankingActive: active,
        });
      })
      .catch(error => {
        console.log("can't get feature toggle" + error);
        this.logger.error({
          class: 'PageContainer',
          method: this.componentWillMount.name,
          action: error,
          params: { error },
        });
      });
  }
  render() {
    return (
      <div className="page-container">
        <div className="main-content">{this.renderSwitch(this.props.page)}</div>
        <footer className="content-footer">
          <div className="footer">
            <div className="copyright">
              <span>RecruitInc © 2019. All rights reserved.</span>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default PageContainer;
