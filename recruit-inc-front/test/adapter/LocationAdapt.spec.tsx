import { LocationAdapter } from '../../src/app/adapter/Location/LocationAdapter';
import { Location } from '../../src/app/model/Location/Location';

const unscannJSON = require('../samples/unscannedUserPortSpain.json');
const allUserJSON = require('../samples/getUserDbPortSpain.json');

describe('Testing Location Adapter, Success Scenario', () => {
  it('Test Location Adapter', () => {
    const targetLocation: string = 'port-of-spain';
    const adapter: LocationAdapter = new LocationAdapter();
    const locationsExtracted: Location = adapter.adapt(
      targetLocation,
      allUserJSON,
      unscannJSON
    );
    const isLocationInside: boolean =
      locationsExtracted.name === 'port-of-spain' &&
      locationsExtracted.scannedUsers === 0;
    expect(isLocationInside).toBe(true);
  });

  it('Test Location Adapter, Failure Scenario', () => {
    const targetLocation: string = 'port-of-spain';
    const adapter: LocationAdapter = new LocationAdapter();
    const locationsExtracted: Location = adapter.adapt(
      targetLocation,
      "{'name':'Paul'}",
      "{'random':'json'}"
    );
    const isSetToZero: boolean =
      locationsExtracted.numberOfUsers === 0 &&
      locationsExtracted.scannedUsers === 0;
    expect(isSetToZero).toBe(false);
  });
});
