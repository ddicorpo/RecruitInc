import * as React from 'react';
const logoPNG = require("../assets/images/logo/logo.png");
const logoWhitePNG = require("../assets/images/logo/logo-white.png");

class Header extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: 'looking..',
    };
  }

  toto() {
    // function($, window){
    //
    //     var header = {};
    //
    //     header.init = function() {
    //
    //         //Search Input Toggle
    //         $('.search-toggle').on('click', function(e) {
    //             $('.search-box, .search-input').toggleClass("active");
    //             $('.search-input input').focus();
    //             e.preventDefault();
    //         });
    //
    //         //Expand Search Predict
    //         $('.search-input input').on('keyup',function(){
    //             if($(this).val().length > 0) {
    //                 $('.search-predict').addClass("active");
    //             }
    //             else {
    //                 $('.search-predict').removeClass("active");
    //             }
    //             $('.serach-text-bind').html($(this).val());
    //         })
    //     };
    //     window.header = header;
    //
    // }(jQuery, window);
  }

  render() {
    const logo = {
      backgroundImage: `url(${logoPNG})`,
    } as React.CSSProperties;

    const logoWhite = {

      backgroundImage: `url(${logoWhitePNG})`,
    } as React.CSSProperties;

    const sidebarCollapseClass = this.props.sidebarCollapse
      ? 'sidenav-fold-toggler'
      : 'sidenav-expand-toggler';

    return (
      <div>

        <div>
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
                    <i className="mdi mdi-menu" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
