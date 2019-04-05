import { BaseService } from './BaseService';
import { Routes } from '../Routes';
import axios from 'axios';

export class ObtainTechnologies extends BaseService {
  constructor() {
    super();
    this.serviceName = Routes.ObtainTechnologies;
    this.serviceAddress = this.buildServiceAddress(Routes.ObtainTechnologies);
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
