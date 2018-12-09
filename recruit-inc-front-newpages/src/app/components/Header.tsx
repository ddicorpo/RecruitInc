import * as React from 'react';

import logoPNG from "../assets/images/logo/logo.png";
import logoWhitePNG from "../assets/images/logo/logo-white.png";


class Header extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
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
                            <div className="logo logo-dark" style={logo}/>
                            <div className="logo logo-white" style={logoWhite}/>
                        </a>
                    </div>
                    <ul className="nav-left">
                        <li>
                            <a className={sidebarCollapseClass}>
                                <i onClick={this.props.handleSidebarClick} className="mdi mdi-menu"/>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default Header;
