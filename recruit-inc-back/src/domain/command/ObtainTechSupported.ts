import { AbstractCommand } from './AbstractCommand';
import { Technologies } from '../../matching-algo/data-model/output-model/Technologies';
import { RequestContext } from './RequestContext';

export class ObtainTechSupported extends AbstractCommand {
  constructor(applicationContext?: RequestContext) {
    super();
  }
  public execute(): any {
    return JSON.stringify(Technologies);
  }
}
