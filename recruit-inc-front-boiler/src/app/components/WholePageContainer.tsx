import * as React from 'react';
import Header from './Header';
import "../assets/css/app.css"
import "../assets/css/materialdesignicons.min.css"
import "../assets/css/font-awesome.min.css"
import "../assets/css/themify-icons.css"
import "../assets/css/animate.min.css"
import "../assets/css/bootstrap.css"
import "../assets/css/pace-theme-minimal.css"
import "../assets/css/perfect-scrollbar.css"
import SideNavigationBar from "./SideNavigationBar";
import {Pages} from "../pages/Pages";
import PageContainer from "./PageContainer";


class WholePageContainer extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.handleSidebarToggleClick = this.handleSidebarToggleClick.bind(this);
        this.handleProfileClick = this.handleProfileClick.bind(this);
        this.handleSidebarClick = this.handleSidebarClick.bind(this);
        this.state = {
            sidebarCollapse: false,
            profileCollapse: true,
            pageToShow: Pages.CANDIDATE_SEARCH,
        };
    }

    handleSidebarToggleClick() {
        this.setState({
            sidebarCollapse: !this.state.sidebarCollapse,
        });
    }

    handleSidebarClick(page: string) {
        this.setState({
            pageToShow: page,
        });
    }

    handleProfileClick() {
        this.setState({
            profileCollapse: !this.state.profileCollapse,
        });
    }

    render() {
        const sideNavStatus: string = this.state.sidebarCollapse ? " side-nav-folded" : "";
        const appStyle: string = "app header-success-gradient" + sideNavStatus;
        return (
            <div className={appStyle}>
                <div className="layout">
                    <Header
                        handleSidebarClick={this.handleSidebarToggleClick}
                        handleProfileClick={this.handleProfileClick}
                        sidebarCollapse={this.state.sidebarCollapse}
                        profileCollapse={this.state.profileCollapse}
                    />
                    <SideNavigationBar
                        handleSidebarClick={this.handleSidebarClick}
                    />
                    <PageContainer
                        page = {this.state.pageToShow}
                    />
                </div>
            </div>
        );
    }
}

export default WholePageContainer;
