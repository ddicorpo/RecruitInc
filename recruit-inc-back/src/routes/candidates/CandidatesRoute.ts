import { baseRoute } from '../baseRoute';
import { ObtainCandidatesCommand } from '../../domain/command/ObtainCandidatesCommand';
import { Response, Request } from 'express';
import { IApplicantModel } from '../../domain/model/IApplicantModel';
import { ObtainRankedCandidatesCommand } from '../../domain/command/ObtainRankedCandidatesCommand';

export class CandidatesRoute extends baseRoute {
  public routes(app): void {
    /**
     * GET to obain all candidate in database (assuming we only have Montreal people for now)
     */
    app
      .route('/api/candidates')
      .get(async (request: Request, response: Response) => {
        try {
          const candidatesCommand: ObtainCandidatesCommand = new ObtainCandidatesCommand();
          let candidates: IApplicantModel[];
          let page: number = request.query.page;
          if (request.query.filter === undefined && page === undefined) {
            // User wants all candidates
            candidates = await candidatesCommand.getAllCandidates();
          } else {
            //User wants candidates by page
            const rawFilters = request.query.filter;

            // Make sure the filters always are in an array
            let filter: string[] = [];

            if (rawFilters !== undefined) {
              filter = Array.isArray(rawFilters) ? rawFilters : [rawFilters];
            }

            candidates = await candidatesCommand.getCandidates(page, filter);
          }

          this.logCommandCompleted(
            this.routes.name,
            ' GET candidates with filter... '
          );
          response.status(200).send(candidates);
        } catch (CommandException) {
          this.logCommandFailure(
            this.routes.name,
            'GET Candidates',
            CommandException.name,
            CommandException.message
          );
          response.send(404).send("Can't get Candidates");
        }
      });

      // Duplicate code since we want to use feature toggle for ranking
    
    app
      .route('/api/candidates/ranking')
      .get(async (request: Request, response: Response) => {
        //TODO: Add feature toggle request
        const isRankingEnable : boolean = true;
        if(isRankingEnable){
          try {
            const candidatesCommand: ObtainRankedCandidatesCommand = new ObtainRankedCandidatesCommand();
            let candidates: IApplicantModel[];
            let page: number = request.query.page;
            if (request.query.filter === undefined && page === undefined) {
              // User wants all candidates, can't ranked on nothing
              candidates = await candidatesCommand.getAllCandidates();
            } else {
              //User wants candidates by page
              const rawFilters = request.query.filter;

              // Make sure the filters always are in an array
              let filter: string[] = [];

              if (rawFilters !== undefined) {
                filter = Array.isArray(rawFilters) ? rawFilters : [rawFilters];
              }
              candidates = await candidatesCommand.getCandidates(page, filter);
            }

            this.logCommandCompleted(
              this.routes.name,
              ' GET candidates with filter and ranking... '
            );
            response.status(200).send(candidates);
          } catch (CommandException) {
            this.logCommandFailure(
              this.routes.name,
              'GET Candidates',
              CommandException.name,
              CommandException.message
            );
            response.send(404).send("Can't get Candidates");
          }
        }else{
          response.send(404).send("Route not found");
        }

      });

    //Route to retrieve info for a specific user. ex: /api/candidates/search?username=robert
    app
        .route('/api/candidates/search')
        .get(async (request: Request, response: Response) => {

          try {
            const candidatesCommand: ObtainCandidatesCommand = new ObtainCandidatesCommand();
            let username: string = request.query.username;
            let candidates: IApplicantModel[];

            candidates = await candidatesCommand.getCandidateByUsername(username);

            this.logCommandCompleted(
                this.routes.name,
                ' GET Search candidate by username... '
            );
            response.status(200).send(candidates);
          } catch (CommandException) {
            this.logCommandFailure(
                this.routes.name,
                'GET Candidates by username',
                CommandException.name,
                CommandException.message
            );
            response.send(404).send("Can't get Candidates");
          }


        });

    app
      .route('/api/candidates/technologies')
      .get(async (request: Request, response: Response) => {
        try {
          const candidatesTechnologies: ObtainCandidatesCommand = new ObtainCandidatesCommand();
          let page: number = request.query.page;
          let filter: string = request.query.filter;

          const Tech = await candidatesTechnologies.getCandidatesTechnologies(
            page,
            filter
          );

          this.logCommandCompleted(
            this.routes.name,
            ' GET candidates with filter... '
          );
          response.status(200).send(Tech);
        } catch (CommandException) {
          this.logCommandFailure(
            this.routes.name,
            'GET Candidates',
            CommandException.name,
            CommandException.message
          );
          response.send(404).send("Can't get Candidates technologies");
        }
      });
  }
}
