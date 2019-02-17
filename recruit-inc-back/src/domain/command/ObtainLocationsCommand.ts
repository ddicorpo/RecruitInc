import { AbstractCommand } from './abstractCommand';
import { RequestContext } from './RequestContext';

export class ObtainLocationsCommand extends AbstractCommand {
    constructor(applicationContext?: RequestContext) {
        super();
    }
    public execute(): any {
        return JSON.stringify(Locations);
    }

}

export enum Locations {
    Montreal = 'Montreal'
}