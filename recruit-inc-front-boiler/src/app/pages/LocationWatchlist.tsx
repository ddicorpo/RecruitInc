import * as React from 'react';


class LocationWatchList extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }


    render() {
        return (
                <div className="container-fluid">
                    <div className="page-header">
                        <h2 className="header-title">Location Watchlist</h2>
                    </div>
                    <div className="card">
                        <div className="card-header border bottom">
                            <h4 className="card-title">Search and Add</h4>
                        </div>
                        <div className="card-body">
                            <div className="row m-t-30">
                                <div className="col-md-4">
                                    <div className="p-h-10">
                                        <div className="form-group">
                                            <label className="control-label">Add city to watchlist</label>
                                            <input type="text" className="form-control" placeholder="City"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-h-10">
                                        <div className="form-group">
                                            <button id="save" className="btn btn-success form-control"
                                                    type="button">Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
}

export default LocationWatchList;