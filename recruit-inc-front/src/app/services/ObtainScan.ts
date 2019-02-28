import { Routes } from '../Routes';
import { baseService } from './baseService';
import axios from 'axios';

export class ObtainScan extends baseService {
  constructor() {
    super();
    this.serviceName = Routes.ObtainScan;
    this.serviceAddress = this.buildServiceAddress(Routes.ObtainScan);
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
