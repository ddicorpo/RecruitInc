import { LocationWatch } from '../../model/Location/LocationWatch';
import { LocationList } from '../../model/Location/LocationList';

/**
 * Take JSON return all our current location we are scanning.
 */
export class LocationAdapter {
  public adapt(rawJson): LocationList {
    let locations: LocationList = new LocationList([]);
    for (let index = 0; index < rawJson.length; index++) {
      try {
        const locationName: string = rawJson[index].location;
        let numberOfUser: number = rawJson[index].total_number;
        let numberOfScannedUser: number = rawJson[index].number_scanned;
        locations.LocationList.push(
          new LocationWatch(locationName, numberOfUser, numberOfScannedUser)
        );
      } catch (Exception) {
        console.log('Cant adapt location at ' + index);
      }
    }
    return locations;
  }
}
