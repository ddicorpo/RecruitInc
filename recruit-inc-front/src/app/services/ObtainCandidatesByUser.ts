import { BaseService } from './BaseService';
import { Routes } from '../Routes';
import axios from 'axios';

export class ObtainCandidatesByUser extends BaseService {
  private username: string = '';

  constructor() {
    super();
    this.serviceName = Routes.ObtainCandidateByUser;
    this.serviceAddress = this.buildServiceAddress(
      Routes.ObtainCandidateByUser
    );
  }

  public setUsername(username: string) {
    this.username = username;
  }

  public execute(): any {
    let addressToExecute: string =
      this.serviceAddress + '?username=' + this.username;

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
