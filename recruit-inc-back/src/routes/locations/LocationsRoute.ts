import { ObtainLocationsCommand } from '../../domain/command/ObtainLocationsCommand';
import {Request, Response} from 'express';
import { baseRoute } from "../baseRoute";

/**
 * Contains Location Route
 */
export class LocationsRoute extends baseRoute {


    public routes(app): void {
        /**
         * GET to obain all supported location by the application
         */
        app.route('/api/locations').get(async (request: Request, response: Response) => {
            try {
                const locationCommand: ObtainLocationsCommand = new ObtainLocationsCommand();
                const allLocationJSON: any = await locationCommand.execute();
                response.status(200).send(allLocationJSON);
                this.logCommandCompleted(this.routes.name, " GET Supported Location... ");
            } catch (CommandException) {
                response.send(500).send("Can't get Locations");
                this.logCommandFailure(this.routes.name,
                    "GET Supported Location",
                    "CommandException",
                    CommandException);
            }
        });
    }
}