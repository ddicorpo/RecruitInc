import { Logger } from "../Logger";

export class baseRoute {

    private logger : Logger
    public constructor(){
        this.logger = new Logger();
    }

    logCommandCompleted(methodName: string, specificRoute: string): void {
        this.logger.info({
            class: methodName,
            method: methodName,
            action: 'Command Completed with ' + specificRoute,
            params: {},
        });
    }
    logCommandFailure(methodName: string, specificRoute: string, errorName: string,
        errorDesc: string): void {
        this.logger.info({
            class: specificRoute,
            method: methodName,
            action: 'Command Failed reason: ' + errorName + ' desc: ' + errorDesc,
            params: {},
        });
    }
}