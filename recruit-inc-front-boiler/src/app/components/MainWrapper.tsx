import * as React from 'react';
import Header from './Header';
import "../assets/css/app.css"
import "../assets/css/materialdesignicons.min.css"


class MainWrapper extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.handleSidebarClick = this.handleSidebarClick.bind(this);
    this.handleProfileClick = this.handleProfileClick.bind(this);
    this.state = {
      sidebarCollapse: false,
      profileCollapse: true,
    };
  }

  handleSidebarClick() {
    this.setState({
      sidebarCollapse: !this.state.sidebarCollapse,
    });
  }

  handleProfileClick() {
    this.setState({
      profileCollapse: !this.state.profileCollapse,
    });
  }

  render() {
    return (
      <Header
        handleSidebarClick={this.handleSidebarClick}
        handleProfileClick={this.handleProfileClick}
        sidebarCollapse={this.state.sidebarCollapse}
        profileCollapse={this.state.profileCollapse}
      />
    );
  }
}

export default MainWrapper;
