import { LocationWatch } from '../../model/Location/LocationWatch';

/**
 * Take JSON return all our current location we are scanning.
 */
export class LocationAdapter {
  public adapt(
    locationName: string,
    allUserJSON: any[],
    unscannedUserJSON: any[]
  ): LocationWatch {
    let numberOfUser: number = 0;
    let numberOfScannedUser: number = 0;
    numberOfScannedUser = allUserJSON.length - unscannedUserJSON.length;
    numberOfUser = allUserJSON.length;

    return new LocationWatch(locationName, numberOfUser, numberOfScannedUser);
  }
}
