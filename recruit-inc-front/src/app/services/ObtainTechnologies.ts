import { baseService } from './baseService';
import { Routes } from '../Routes';

export class ObtainTechnologies extends baseService {
  constructor() {
    super();
    this.serviceName = 'ObtainLocations';
    this.serviceAddress = this.buildServiceAddress(Routes.ObtainCandidates);
  }

  public execute(): any {
    fetch(this.serviceAddress)
      .then(response => response.json())
      .then(
        result => {
          this.logActionCompleted(this.serviceName);
          return result;
        },
        error => {
          this.logActionFailure(this.serviceName, error.name, error.message);
          return error;
        }
      );
  }
}
