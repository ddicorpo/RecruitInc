import * as React from 'react';
import { ObtainScan } from '../services/ObtainScan';
import { LocationList } from '../model/Location/LocationList';
import { LocationWatchListState } from '../states/LocationWatchListState';
import { LocationListComponent } from '../components/Location/LocationListComponent';
import { LocationAdapter } from '../adapter/Location/LocationAdapter';

class LocationWatchList extends React.Component<any, LocationWatchListState> {
  constructor(props) {
    super(props);
    const initState: LocationList = new LocationList([]);
    this.state = {
      locationState: initState,
    };
    this.handleTextInput = this.handleTextInput.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
  }

  componentDidMount() {
    this.loadLocationWatchList();
  }
  loadLocationWatchList = (event?) => {
    const scanService: ObtainScan = new ObtainScan();
    const adapter: LocationAdapter = new LocationAdapter();
    scanService
      .execute()
      .then(results => {
        console.log(results.data);
        let locations: LocationList = adapter.adapt(results.data);
        scanService.logActionCompleted(scanService.serviceName);
        this.setState({
          locationState: locations,
        });
      })
      .catch(error => {
        scanService.logActionFailure(scanService.serviceName, error, error);
      });
  };

  private handleAdd(event): void {
    //Unsupported feature
    event.preventDefault();
    alert('Not Supported');
  }

  private handleTextInput(event): void {
    event.preventDefault();
  }

  handleRefresh = event => {
    event.preventDefault();
    this.loadLocationWatchList(event);
  };

  render() {
    return (
      <div className="container-fluid">
        <div className="page-header">
          <h2 className="header-title">Location Watchlist</h2>
          <div className="card">
            <div className="card-header border bottom">
              <h4 className="card-title">Control Panel</h4>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="control-label super-button">&nbsp;</label>
                    <button
                      id="refresh"
                      className="btn btn-success form-control super-button"
                      type="button"
                      onClick={this.handleRefresh}
                    >
                      Refresh
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid" />
        <LocationListComponent Locations={this.state.locationState} />
      </div>
    );
  }
}

export default LocationWatchList;
