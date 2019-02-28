import { Location } from './Location';

export class LocationWatchList {
  LocationList: Location[];
  constructor(LocationList: Location[]) {
    this.LocationList = LocationList;
  }
}
