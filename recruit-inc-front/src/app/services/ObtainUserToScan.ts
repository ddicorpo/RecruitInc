import { Routes } from '../Routes';
import { baseService } from './baseService';
import axios from 'axios';

export class ObtainUserToScan extends baseService {
  constructor() {
    super();
    this.serviceName = Routes.ObtainUserToScan;
    this.serviceAddress = this.buildServiceAddress(Routes.ObtainUserToScan);
  }

  public execute(location: string): any {
    return axios.request({
      url: this.serviceAddress + location,
      method: 'get',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  }
}
