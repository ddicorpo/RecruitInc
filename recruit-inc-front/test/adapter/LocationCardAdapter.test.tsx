import { LocationAdapter } from '../../src/app/adapter/Location/LocationAdapter';
import { LocationWatch } from '../../src/app/model/Location/LocationWatch';

const rawJsonAllUser = require('../samples/getUserDbPortSpain.json');
const rawJsonUnscannedUser = require('../samples/unscannedUserPortSpain.json');
const cityName: string = 'port-of-spain';
const sinon = require('sinon');

describe('Testing Location Adapter, Success Scenario', () => {
  it('Test LocationWatch Adapter', () => {
    const adapter: LocationAdapter = new LocationAdapter();
    const locationsExtracted: LocationWatch = adapter.adapt(
      cityName,
      rawJsonAllUser,
      rawJsonUnscannedUser
    );
    const isLocationInside: boolean =
      locationsExtracted.numberOfUsers == 10 &&
      locationsExtracted.scannedUsers == 0;
    expect(isLocationInside).toBe(true);
  });

  it('Test the adapt method', () => {
    const adapter: LocationAdapter = new LocationAdapter();
    const adaptSpy = sinon.spy(adapter, 'adapt');
    adapter.adapt(cityName, rawJsonAllUser, rawJsonUnscannedUser);
    expect(adaptSpy.calledOnce);
    expect(adaptSpy.calledWith('port-of-spain'));
    adaptSpy.restore();
  });
});
