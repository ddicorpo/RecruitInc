import fetch from 'node-fetch';

let fflip = require('fflip');

export class ToggleFeature {
  public async retrieveToggleFeature(): Promise<void> {
    console.log('Retrieving toggle feature configs ');
    fflip.config({
      criteria: await this.getCriteria(),
      features: await this.getFeature(),
    });
    //Toggle enabled for new feature rollout. (example)
    if (fflip.features.newFeatureRollout.enabled) {
      console.log('New Feature Rollout is Enabled');
    }
  }

  private getFeature(): Promise<any> {
    return fetch(
      process.env.DOMAIN_TOGGLE_FEATURE +
        ':' +
        process.env.PORT_TOGGLE_FEATURE +
        '/backend/feature',
      { method: 'get' }
    ).then(response => response.json());
  }
  private getCriteria(): Promise<any> {
    return fetch(
      process.env.DOMAIN_TOGGLE_FEATURE +
        ':' +
        process.env.PORT_TOGGLE_FEATURE +
        '/backend/criteria',
      { method: 'get' }
    ).then(response => response.json());
  }
}
