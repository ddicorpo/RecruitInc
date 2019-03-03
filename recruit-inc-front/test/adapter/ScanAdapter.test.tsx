import { ScanAdapter } from '../../src/app/adapter/Location/ScanAdapter';
const rawJSON = require('../samples/findScan.json');

describe('Testing Scan Adapter, Success Scenario', () => {
  it('Test Scan Adapter', () => {
    const targetLocation: string = 'port-of-spain';
    const adapter: ScanAdapter = new ScanAdapter();
    const locationsExtracted: string[] = adapter.adapt(rawJSON);
    const isLocationInside: boolean = locationsExtracted.includes(
      targetLocation
    );
    expect(isLocationInside).toBe(true);
  });

  it('Test Scan Adapter, Failure Scenario', () => {
    const targetLocation: string = 'port-of-spain';
    const adapter: ScanAdapter = new ScanAdapter();
    const locationsExtracted: string[] = adapter.adapt("{'name':'Paul'}");
    const isLocationInside: boolean = locationsExtracted.includes(
      targetLocation
    );
    expect(isLocationInside).toBe(false);
  });

  it('Test Scan Adapter for another location', () => {
    const targetLocation: string = 'rosemere';
    const adapter: ScanAdapter = new ScanAdapter();
    const locationsExtracted: string[] = adapter.adapt(rawJSON);
    const isLocationInside: boolean = locationsExtracted.includes(
      targetLocation
    );
    expect(isLocationInside).toBe(true);
  });
});
