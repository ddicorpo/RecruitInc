import { ObtainTechSupported } from "../domain/command/ObtainTechSupported";
import {Logger} from '../Logger';
import { Request, Response } from 'express';
/**
 * This class is a temporary script to ensure
 * a deployment 27 Jan.
 */

 export class MvpRoute {

    private logger : Logger

    public constructor(){
        this.logger = new Logger();
    }

    public routes(app): void {
        /**
         * GET to obtain JSON of tech supported
         */
        app.route('/api/supportedTech').get(async(request: Request
            , response: Response) => {
            try{
                const techCommand: ObtainTechSupported = new ObtainTechSupported();
                const allTechJSON: any = techCommand.execute();
                response.status(200).send(allTechJSON);
                this.logCommandCompleted(this.routes.name," GET Supported Tech... ");
            }catch(CommandException){
                response.send(500).send("Can't get tech");
                this.logCommandFailure(this.routes.name, 
                    "GET Supported Tech", 
                    "CommandException", 
                    CommandException);
            }
        });

        
    }
     private logCommandCompleted(methodName: string, specificRoute: string): void {
         this.logger.info({
             class: "MvpRoute",
             method: methodName,
             action: 'Command Completed with ' + specificRoute ,
             params: {},
         });
     }
     private logCommandFailure(methodName: string, specificRoute: string, errorName: string,
         errorDesc: string): void {
         this.logger.info({
             class: 'MvpRoute',
             method: methodName,
             action: 'Command Failed reason: ' + errorName + ' desc: ' + errorDesc,
             params: {},
         });
     }
     
 }