import * as React from 'react';
import { ObtainScan } from '../services/ObtainScan';
import { ScanAdapter } from '../adapter/Location/ScanAdapter';
import { ObtainUserToScan } from '../services/ObtainUserToScan';
import { ObtainUnscanUser } from '../services/ObtainUnscanUser';
import { LocationAdapter } from '../adapter/Location/LocationAdapter';
import { LocationWatch } from '../model/Location/LocationWatch';
import { LocationList } from '../model/Location/LocationList';
import { LocationWatchListState } from '../states/LocationWatchListState';
import { LocationListComponent } from '../components/Location/LocationListComponent';

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

  fillLocationWatchList = locations => {
    const allUserService: ObtainUserToScan = new ObtainUserToScan();
    const unScanUserService: ObtainUnscanUser = new ObtainUnscanUser();
    const locationAdapter: LocationAdapter = new LocationAdapter();
    let finalLocation: LocationWatch[] = [];

    var allPromises: Promise<any>[] = [];
    for (let loc of locations) {
      let prom: Promise<any> = allUserService.execute(loc);
      allPromises.push(prom);
      let promUnscan: Promise<any> = unScanUserService.execute(loc);
      allPromises.push(promUnscan);
    }

    Promise.all(allPromises).then(values => {
      let allUserJSONs: any[] = [];
      let unScanUserJSONs: any[] = [];

      // Separate the results back in proper place
      for (let index = 0; index < values.length; index++) {
        if (index % 2 == 0) {
          allUserJSONs.push(values[index]);
        } else {
          unScanUserJSONs.push(values[index]);
        }
      }

      // Build proper data struc.
      for (let index = 0; index < allUserJSONs.length; index++) {
        let loca: LocationWatch = locationAdapter.adapt(
          locations[index],
          allUserJSONs[index].data,
          unScanUserJSONs[index].data
        );
        finalLocation.push(loca);
      }
      this.setState({
        locationState: new LocationList(finalLocation),
      });
    });
  };
  loadLocationWatchList = (event?) => {
    const scanService: ObtainScan = new ObtainScan();
    const scanAdapter: ScanAdapter = new ScanAdapter();

    let locations: string[] = [];
    scanService
      .execute()
      .then(results => {
        locations = scanAdapter.adapt(results.data);
        scanService.logActionCompleted(scanService.serviceName);
        this.fillLocationWatchList(locations);
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
