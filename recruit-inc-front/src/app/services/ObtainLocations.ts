import { Routes } from '../Routes';
import { baseService } from './baseService';

export class ObtainLocations extends baseService {
  constructor() {
    super();
    this.serviceName = 'ObtainLocations';
    this.serviceAddress = this.buildServiceAddress(Routes.ObtainLocations);
  }

  public async execute(): Promise<any> {
    fetch(this.serviceAddress)
      .then(response => response.json())
      .then(
        result => {
          this.logActionCompleted(this.serviceName);
          console.log('from service');
          console.log(result);
          return result;
        },
        error => {
          this.logActionFailure(this.serviceName, error.name, error.message);
          return error;
        }
      );
  }
}
