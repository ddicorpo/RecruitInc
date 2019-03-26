import * as React from 'react';
import SideNavigationItem from "./SideNavigationItem";
import {Pages} from "../pages/Pages";



class SideNavigationBar extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }


    render() {

        return (

            <div className="side-nav expand-lg">
                <div className="side-nav-inner">
                    <ul className="side-nav-menu scrollable">
                        <li className="side-nav-header">
                            <span>Navigation</span>
                        </li>
                        <SideNavigationItem
                            menuTitle={Pages.CANDIDATE_SEARCH}
                            iconClass="mdi mdi-magnify"
                            handleSidebarClick={this.props.handleSidebarClick}
                        />
                        <SideNavigationItem
                            menuTitle={Pages.LOCATION_WATCHLIST}
                            iconClass="mdi mdi-map-marker"
                            handleSidebarClick={this.props.handleSidebarClick}
                        />
                        <SideNavigationItem
                            menuTitle={Pages.CANDIDATE_QUESTIONNAIRE}
                            iconClass="mdi mdi-magnify"
                            handleSidebarClick={this.props.handleSidebarClick}
                        />
                    </ul>
                </div>
            </div>
        );
    }
}

export default SideNavigationBar;
