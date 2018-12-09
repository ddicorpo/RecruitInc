import * as React from 'react';
import Header from './Header';
import "../assets/css/bootstrap.css"
import "../assets/css/pace-theme-minimal.css"
import "../assets/css/perfect-scrollbar.css"
import "../assets/css/font-awesome.min.css"
import "../assets/css/themify-icons.css"
import "../assets/css/materialdesignicons.min.css"
import "../assets/css/animate.min.css"
import "../assets/css/app.css"
import SideNavigationBar from "./SideNavigationBar";
import {Pages} from "../pages/Pages";
import PageContainer from "./PageContainer";
import {Logger} from "../Logger";


class WholePageContainer extends React.Component<any, any> {

    private logger: Logger;

    constructor(props: any) {
        super(props);
        this.logger = new Logger();
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
        this.logger.info({
            class: 'WholePageContainer',
            method: 'handleSidebarToggleClick',
            action: 'User clicked to toggle the sidebar collapse.',
            params: { sidebarCollapse: this.state.sidebarCollapse },
        });
        this.setState({
            sidebarCollapse: !this.state.sidebarCollapse,
        });
    }

    handleSidebarClick(page: string) {
        this.logger.info({
            class: 'WholePageContainer',
            method: 'handleSidebarClick',
            action: 'User clicked on a page on the sidebar',
            params: { page },
        });
        this.setState({
            pageToShow: page,
        });
    }

    handleProfileClick() {
        this.logger.info({
            class: 'WholePageContainer',
            method: 'handleProfileClick',
            action: 'User clicked to open/close the profile button on the header',
            params: { profileCollapse: !this.state.profileCollapse },
        });
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
