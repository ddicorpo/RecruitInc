import fetch from 'node-fetch';

let fflip = require('fflip');

export class ToggleFeature {
  private newFeatureRollout: boolean = false;

  public async retrieveToggleFeature(): Promise<void> {
    console.log('Retrieving toggle feature configs ');
    let feature = await this.getFeature();
    let criteria = await this.getCriteria();

    fflip.config({
      criteria: criteria,
      features: feature,
    });
    this.newFeatureRollout = fflip.features.newFeatureRollout.enabled;
  }

  //Toggle enabled for new feature Rollout. (example)
  public isNewFeatureRollout(): boolean {
    return this.newFeatureRollout;
  }

  getFeature(): Promise<any> {
    let url: string =
      'http://' +
      process.env.DOMAIN_TOGGLE_FEATURE +
      ':' +
      process.env.PORT_TOGGLE_FEATURE +
      '/frontend/feature';
    return fetch(url, { method: 'get' }).then(response => response.json());
  }
  getCriteria(): Promise<any> {
    let url: string =
      'http://' +
      process.env.DOMAIN_TOGGLE_FEATURE +
      ':' +
      process.env.PORT_TOGGLE_FEATURE +
      '/frontend/criteria';
    return fetch(url, { method: 'get' }).then(response => response.json());
  }
}
