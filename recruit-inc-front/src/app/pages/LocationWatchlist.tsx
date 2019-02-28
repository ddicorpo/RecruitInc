import * as React from 'react';
import { Logger } from '../Logger';
import { LocationList } from '../components/Location/LocationList';
import { LocationListProps } from '../props/LocationListProps';

class LocationWatchList extends React.Component<any, LocationListProps> {
  private logger: Logger;

  constructor(props: LocationListProps) {
    super(props);
    this.logger = new Logger();
    this.handleTextInput = this.handleTextInput.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
  }

  componentDidMount() {
    this.loadLocationWatchList();
  }

  loadLocationWatchList() {
    this.logger.info({
      class: 'LocationWatchlist',
      method: 'componentDidMount',
      action: 'Loaded the watchlist to the component state',
      params: {},
    });
  }

  private handleAdd(event): void {
    //Unsupported feature
    event.preventDefault();
    alert('Not Supported');
  }

  private handlePause(location: string): void {
    //call backend
    this.logger.info({
      class: 'LocationWatchlist',
      method: 'handlePause',
      action: 'Calling the backend to pause a location on the watchlist',
      params: { location },
    });
    console.log('handlePause', location);
  }

  private handleDelete(location: string): void {
    //call backend
    this.logger.info({
      class: 'LocationWatchlist',
      method: 'handleDelete',
      action: 'Calling the backend to remove a location from the watchlist',
      params: { location },
    });
    console.log('handleDelete', location);
  }

  private handleTextInput(event): void {
    event.preventDefault();
  }

  // private renderTable(): JSX.Element {
  //   const tableContent: JSX.Element[] = [];

  //   for (const tableLine of this.state.watchlistInfo) {
  //     tableContent.push(
  //       <tr>
  //         {<td>{tableLine.location}</td>}
  //         {<td>{tableLine.scanned}</td>}
  //         {<td>{tableLine.totalDev}</td>}
  //         {
  //           <td>
  //             <i
  //               onClick={() => this.handlePause(tableLine.location)}
  //               className="mdi mdi-pause"
  //             />
  //           </td>
  //         }
  //         {
  //           <td>
  //             <i
  //               onClick={() => this.handleDelete(tableLine.location)}
  //               className="mdi mdi-close"
  //             />
  //           </td>
  //         }
  //       </tr>
  //     );
  //   }

  //   return (
  //     <table className="table">
  //       <thead className="thead-light">
  //         <tr>
  //           <th scope="col">Location</th>
  //           <th scope="col">Scanned</th>
  //           <th scope="col">Total developers</th>
  //           <th scope="col" />
  //           <th scope="col" />
  //         </tr>
  //       </thead>
  //       <tbody>{tableContent}</tbody>
  //     </table>
  //   );
  // }

  render() {
    return (
      <div className="container-fluid">
        <div className="page-header">
          <h2 className="header-title">Location Watchlist</h2>
        </div>
        <div className="container">
          <div className="card blur">
            <div className="card-header border bottom">
              <h4 className="card-title">Search and Add</h4>
            </div>
            <div className="card-body">
              <div className="row m-t-30">
                <div className="col-md-4">
                  <div className="p-h-10">
                    <div className="form-group">
                      <label className="control-label">
                        Add city to watchlist
                      </label>
                      <input
                        onChange={this.handleTextInput}
                        type="text"
                        className="form-control"
                        placeholder="City"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-h-10">
                    <div className="form-group">
                      <label className="control-label">&nbsp;</label>
                      <button
                        onClick={this.handleAdd}
                        id="save"
                        className="btn btn-success form-control"
                        type="button"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header border bottom">
              <h4 className="card-title">Watchlist</h4>
            </div>
            <div className="card-body">
              <LocationList LocationList={[]} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LocationWatchList;
