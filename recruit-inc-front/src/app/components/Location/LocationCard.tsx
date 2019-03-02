import React from 'react';
import { LocationCardProps } from '../../props/LocationCardProps';

export class LocationCard extends React.Component<LocationCardProps, {}> {
  constructor(props: LocationCardProps) {
    super(props);
  }

  render() {
    const isRunning: boolean =
      this.props.locationWatchData.numberOfUsers >
      this.props.locationWatchData.scannedUsers;
    return (
      <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
        <div className="card">
          <div className="card-body">
            <h5 className="super-title card-title ">
              {this.props.locationWatchData.name}
            </h5>
            <br />
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <b>Number of user:</b>
                <span> </span>
                {this.props.locationWatchData.numberOfUsers}
              </li>
              <li className="list-group-item">
                <b>Scanned users:</b>
                <span> </span>
                {this.props.locationWatchData.scannedUsers}
              </li>
              <li className="list-group-item">
                <b>Status:</b>
                <span> </span>
                {isRunning ? <span>Running</span> : <span>Finished</span>}
              </li>
            </ul>
            <div className="super-icon">
              {isRunning ? (
                <i className="fa fa-sync fa-3x fa-spin" />
              ) : (
                <i className="fa fa-ban fa-3x fa-spin" />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
