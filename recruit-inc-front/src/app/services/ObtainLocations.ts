import { Routes } from '../Routes';
import { BaseService } from './BaseService';
import axios from 'axios';

export class ObtainLocations extends BaseService {
  constructor() {
    super();
    this.serviceName = Routes.ObtainLocations;
    this.serviceAddress = this.buildServiceAddress(Routes.ObtainLocations);
  }

  public execute(): any {
    return axios.request({
      url: this.serviceAddress,
      method: 'get',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  }
}
