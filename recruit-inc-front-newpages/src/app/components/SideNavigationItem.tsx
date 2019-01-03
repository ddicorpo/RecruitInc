import * as React from 'react';


class SideNavigationItem extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            isDropdownOpened: false,
        };
    }


    render() {

        const dropdownBasicClass: string = "nav-item dropdown";
        const dropdownClass: string = this.state.isDropdownOpened ? dropdownBasicClass + " open" : dropdownBasicClass;
        return (

            <li className={dropdownClass} onClick={() => this.props.handleSidebarClick(this.props.menuTitle)}>
                <a className="dropdown-toggle">
                    <span className="icon-holder">
                        <i className={this.props.iconClass}></i>
                    </span>
                    <span className="title">{this.props.menuTitle}</span>
                </a>
            </li>
        );
    }
}

export default SideNavigationItem;
