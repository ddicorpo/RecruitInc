/**
 * Take JSON return all our current location we are scanning.
 */
export class ScanAdapter {
  public adapt(rawJSON): string[] {
    let locationScanning: string[] = [];
    for (let index = 0; index < rawJSON.length; index++) {
      const loc: string = rawJSON[index].location;
      locationScanning.push(loc);
    }
    return locationScanning;
  }
}
