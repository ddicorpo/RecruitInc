import * as React from 'react';

class RatioFiltering extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="page-header">
          <h2 className="header-title">Ratio Filtering</h2>
        </div>
        <div className="card">
          <div className="card-header border bottom">
            <h4 className="card-title">Search Filters</h4>
          </div>
          <div className="card-body">
            <div className="row m-t-30">
              <div className="col-md-4">
                <div className="p-h-10" />
              </div>
              <div className="col-md-4">
                <div className="p-h-10" />
              </div>
              <div className="col-md-4">
                <div className="p-h-10">
                  <div className="form-group">
                    <label className="control-label">&nbsp;</label>
                    <button
                      id="save"
                      className="btn btn-success form-control super-button"
                      type="button"
                      //onClick={this.handleSearchClick}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header border bottom">
            <h4 className="card-title">Results</h4>
          </div>
        </div>
      </div>
    );
  }
}

export default RatioFiltering;
