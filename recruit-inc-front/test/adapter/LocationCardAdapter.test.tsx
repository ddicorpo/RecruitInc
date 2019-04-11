import { LocationAdapter } from '../../src/app/adapter/Location/LocationAdapter';
import { LocationList } from '../../src/app/model/Location/LocationList';

const rawJsonAllScan = require('../samples/findScan.json');

describe('Testing Location Adapter, Success Scenario', () => {
  it('Test LocationWatch Adapter', () => {
    const adapter: LocationAdapter = new LocationAdapter();
    const locations: LocationList = adapter.adapt(rawJsonAllScan);
    const isLocationInside: boolean =
      locations.LocationList[0].numberOfUsers == 10 &&
      locations.LocationList[0].scannedUsers == 0;
    expect(isLocationInside).toBe(true);
  });
});
