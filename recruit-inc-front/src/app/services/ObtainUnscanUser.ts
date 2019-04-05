import { Routes } from '../Routes';
import { BaseService } from './BaseService';
import axios from 'axios';

export class ObtainUnscanUser extends BaseService {
  constructor() {
    super();
    this.serviceName = Routes.ObtainUnscanUser;
    this.serviceAddress = this.buildServiceAddress(Routes.ObtainUnscanUser);
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
