import * as React from 'react';

import logoPNG from '../assets/images/logo/logo.png';
import logoWhitePNG from '../assets/images/logo/logo-white.png';
import { ToggleFeature } from '../toggle-feature/ToggleFeature';

class Header extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isNewFeatureRollout: false,
    };
  }

  private async isNewFeatureRollout(): Promise<void> {
    let toggleFeature: ToggleFeature = new ToggleFeature();
    await toggleFeature.retrieveToggleFeature();

    this.setState({
      isNewFeatureRollout: toggleFeature.isNewFeatureRollout(),
    });
  }

  private renderTag(): JSX.Element[] {
    const array: JSX.Element[] = [];
    if (this.state.isNewFeatureRollout) {
      array.push(<span className="badge badge-info">New Feature Rollout</span>);
    } else {
      array.push(<span className="badge badge-default">Status: Normal</span>);
    }
    return array;
  }

  async componentWillMount() {
    // See if is a new feature Rollout (example)
    await this.isNewFeatureRollout();
  }

  render() {
    const logo = {
      backgroundImage: `url(${logoPNG})`,
    } as React.CSSProperties;

    const logoWhite = {
      backgroundImage: `url(${logoWhitePNG})`,
    } as React.CSSProperties;

    const sidebarCollapseClass = this.props.sidebarCollapse
      ? 'sidenav-expand-toggler'
      : 'sidenav-fold-toggler';

    return (
      <div className="header navbar">
        <div className="header-container">
          <div className="nav-logo">
            <a href="index.html">
              <div className="logo logo-dark" style={logo} />
              <div className="logo logo-white" style={logoWhite} />
            </a>
          </div>
          <ul className="nav-left">
            <li>
              <a className={sidebarCollapseClass}>
                <i
                  onClick={this.props.handleSidebarClick}
                  className="mdi mdi-menu"
                />
              </a>
            </li>
          </ul>
          <ul className="nav-right">{this.renderTag()}</ul>
        </div>
      </div>
    );
  }
}

export default Header;
