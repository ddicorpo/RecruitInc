import fetch from 'node-fetch';

let fflip = require('fflip');

export class ToggleFeature {

  private newFeatureRollout: boolean = false;
  private cronActive: boolean = false;

  public getNewFeatureRollout(): boolean {
    return this.newFeatureRollout;
  }

  public getCronActive(): boolean {
    return this.cronActive;
  }

  public async retrieveToggleFeature(): Promise<void> {
    console.log('Retrieving toggle feature configs ');
    fflip.config({
      criteria: await this.getCriteria(),
      features: await this.getFeature(),
    });
    //Toggle enabled for new feature rollout.
    if (fflip.features.newFeatureRollout.enabled) {
      this.newFeatureRollout = true;
      console.log('New Feature Rollout is Enabled');
    }
    //Feature is retrieved to see if the cron job should run
    if (fflip.features.cronActive.enabled) {
      this.cronActive = true;
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
