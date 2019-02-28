import * as React from 'react';
import { Logger } from '../Logger';
import { LocationListProps } from '../props/LocationListProps';
import { ObtainScan } from '../services/ObtainScan';

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
    const scanService: ObtainScan = new ObtainScan();

    scanService.execute().then(results => {});

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

  private handleTextInput(event): void {
    event.preventDefault();
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="page-header">
          <h2 className="header-title">Location Watchlist</h2>
        </div>
        <div className="container" />
      </div>
    );
  }
}

export default LocationWatchList;
