import { Location } from 'src/app/model/Location/Location';

/**
 * Take JSON return all our current location we are scanning.
 */
export class LocationAdapter {
  public adapt(locationName: string, allUserJSON, unscannedUserJSON): Location {
    let numberOfUser: number = 0;
    let numberOfScannedUser: number = 0;

    numberOfScannedUser = allUserJSON.length - unscannedUserJSON.lenght;
    numberOfUser = allUserJSON.lenght;

    return new Location(locationName, numberOfUser, numberOfScannedUser);
  }
}
