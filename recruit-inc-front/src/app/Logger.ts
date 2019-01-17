//Module fs is not available in the browser  !!!
import * as util from 'util';

interface ILoggerParam {
  class: string;
  method: string;
  action: string;
  params: {
    [key: string]: any;
  };
  value?: {
    [key: string]: any;
  };
}

interface ILogger {
  silly: (loggerParam: ILoggerParam) => void;
  error: (loggerParam: ILoggerParam) => void;
  info: (loggerParam: ILoggerParam) => void;
  warn: (loggerParam: ILoggerParam) => void;
  verbose: (loggerParam: ILoggerParam) => void;
  debug: (loggerParam: ILoggerParam) => void;
}

interface ILoggerContextInfo {
  timestamp: string;
  processID: number;
}
/**
 * This logger now printing log in the console
 * We shall soon connect the logger with a log database
 * We can send the log as JSON instead of printing
 */
export class Logger implements ILogger {
 // private logDirectory: string = 'log';
 // private directoryExists: boolean = false;

  public constructor() {
  }

  
  public debug(param: ILoggerParam): void {
    const context: ILoggerContextInfo = this.getContextInfo();
    console.log(this.stringifyLog(param, context));
  }

  public error(param: ILoggerParam): void {
    const context: ILoggerContextInfo = this.getContextInfo();
    console.log(this.stringifyLog(param, context));
  }

  public info(param: ILoggerParam): void {
    const context: ILoggerContextInfo = this.getContextInfo();
    console.log(this.stringifyLog(param, context));
  }

  public silly(param: ILoggerParam): void {
    const context: ILoggerContextInfo = this.getContextInfo();
    console.log(this.stringifyLog(param, context));
  }

  public verbose(param: ILoggerParam): void {
    const context: ILoggerContextInfo = this.getContextInfo();
    console.log(this.stringifyLog(param, context));
  }

  public warn(param: ILoggerParam): void {
    const context: ILoggerContextInfo = this.getContextInfo();
    console.log(this.stringifyLog(param, context));
  }

  private getContextInfo(): ILoggerContextInfo {
    const timestamp: string = new Date().toLocaleString();
    const processID: number = process.pid;

    return { timestamp, processID };
  }

  private stringifyLog(
    param: ILoggerParam,
    context: ILoggerContextInfo
  ): string {
    return util.inspect({
      param,
      context,
    });
  }
}
