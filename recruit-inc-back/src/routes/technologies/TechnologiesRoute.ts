import { baseRoute } from '../baseRoute';
import { ObtainTechSupported } from '../../domain/command/ObtainTechSupported';
import { Request, Response } from 'express';

export class TechnologiesRoute extends baseRoute {
  public routes(app): void {
    /**
     * GET to obtain JSON of tech supported
     */
    app
      .route('/api/technologies')
      .get(async (request: Request, response: Response) => {
        try {
          const techCommand: ObtainTechSupported = new ObtainTechSupported();
          const allTechJSON: any = await techCommand.execute();
          response.status(200).send(allTechJSON);
          console.log(this.routes.name);
          this.logCommandCompleted(this.routes.name, ' GET Supported Tech... ');
        } catch (CommandException) {
          this.logCommandFailure(
            this.routes.name,
            'GET Supported Tech',
            'CommandException',
            CommandException
          );
          response.send(404).send("Can't get tech");
        }
      });
  }
}
