import { Routes } from '../Routes';
import { baseService } from './baseService';
import axios from 'axios';

export class ObtainRatio extends baseService {
  constructor() {
    super();
    this.serviceName = Routes.ObtainRatio;
    this.serviceAddress = this.buildServiceAddress(Routes.ObtainRatio);
  }

  public execute(login: string, id: string): any {
    return axios.request({
      url: this.serviceAddress + login + '/' + id,
      method: 'get',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  }
}
