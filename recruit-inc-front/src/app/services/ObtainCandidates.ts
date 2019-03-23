import { baseService } from './baseService';
import { Routes } from '../Routes';
import axios from 'axios';
import { ToggleFeature } from '../toggle-feature/ToggleFeature';

export class ObtainCandidates extends baseService {
  private page: number = 1;
  private filters: any[];

  constructor() {
    super();
    this.serviceName = Routes.ObtainCandidates;
    this.serviceAddress = this.buildServiceAddress(Routes.ObtainCandidates);
  }

  public changePage(page: number) {
    this.page = page;
  }

  public applyFilters(filters: string[]) {
    this.filters = filters;
  }

  public async execute(): Promise<any> {
    let toggleFeature: ToggleFeature = new ToggleFeature();
    await toggleFeature.retrieveToggleFeature();

    let addressToExecute: string = this.serviceAddress;

    //Toggle that we can turn on with the toggle feature
    if (toggleFeature.isNewFeatureRollout()) {
      addressToExecute = addressToExecute + '/ranking';
    }

    addressToExecute = addressToExecute + '?page=' + this.page;

    let filterParams: string = '';
    if (typeof this.filters != 'undefined') {
      for (let params of this.filters) {
        filterParams = filterParams + '&filter=' + params.value;
      }
    }

    addressToExecute = addressToExecute + filterParams;

    console.log(addressToExecute);

    return axios.request({
      url: addressToExecute,
      method: 'get',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  }
}
