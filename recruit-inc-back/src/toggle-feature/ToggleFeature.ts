import fetch from 'node-fetch';

let fflip = require('fflip');

export class ToggleFeature {

  private _newFeatureRollout: boolean = false;
  private _cronActive: boolean = false;

  get newFeatureRollout(): boolean {
    return this._newFeatureRollout;
  }

  get cronActive(): boolean {
    return this._cronActive;
  }

  public async retrieveToggleFeature(): Promise<void> {
    console.log('Retrieving toggle feature configs ');
    fflip.config({
      criteria: await this.getCriteria(),
      features: await this.getFeature(),
    });
    //Toggle enabled for new feature rollout.
    if (fflip.features._newFeatureRollout.enabled) {
      this._newFeatureRollout = true;
      console.log('New Feature Rollout is Enabled');
    }
    //Feature is retrieved to see if the cron job should run
    if (fflip.features._cronActive.enabled) {
      this._cronActive = true;
      console.log('Cron job is activated using feature toggle "cronActive"');
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
