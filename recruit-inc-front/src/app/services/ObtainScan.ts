import { Routes } from '../Routes';
import { BaseService } from './BaseService';
import axios from 'axios';

export class ObtainScan extends BaseService {
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
