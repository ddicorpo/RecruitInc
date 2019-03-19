import { AbstractCommand } from './AbstractCommand';
import { RequestContext } from './RequestContext';

//TODO: Refactor to get location from cronData table
export class ObtainLocationsCommand extends AbstractCommand {
  constructor(applicationContext?: RequestContext) {
    super();
  }
  public execute(): any {
    return JSON.stringify(Locations);
  }
}

export enum Locations {
  Montreal = 'Montreal',
}
