import { baseService } from './baseService';
import { Routes } from '../Routes';
import axios from 'axios';

export class ObtainCandidates extends baseService {
  constructor() {
    super();
    this.serviceName = Routes.ObtainCandidates;
    this.serviceAddress = this.buildServiceAddress(Routes.ObtainCandidates);
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
