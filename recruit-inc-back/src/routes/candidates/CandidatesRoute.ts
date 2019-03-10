import { baseRoute } from "../baseRoute";
import {ObtainCandidatesCommand } from '../../domain/command/ObtainCandidatesCommand';
import {Response, Request} from 'express'

export class CandidatesRoute extends baseRoute {
    
    public routes(app) : void {
    /**
    * GET to obain all candidate in database (assuming we only have Montreal people for now)
    */
        app.route('/api/candidates').get(async (request: Request, response: Response) => {
            try {
                const candidatesCommand: ObtainCandidatesCommand = new ObtainCandidatesCommand();

                let page : number = request.query.page;
                let filter : string = request.query.filter;

                const candidates: any = await candidatesCommand.execute(page, filter);
                this.logCommandCompleted(this.routes.name, " GET candidates with filter... ");
                response.status(200).send(candidates);

            } catch (CommandException) {
                response.send(500).send("Can't get Candidates");
                this.logCommandFailure(this.routes.name,
                    "GET Candidates",
                    "CommandException",
                    CommandException);
            }
        });
    }
}