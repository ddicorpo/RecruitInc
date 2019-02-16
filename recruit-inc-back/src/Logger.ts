import * as fileSystem from 'fs';
import * as logConfig from 'winston';
import * as util from 'util';
import winston = require('winston');

const { format } = winston;
const { combine, label, json } = format;

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
  silly: (ILoggerParam) => void;
  error: (ILoggerParam) => void;
  info: (ILoggerParam) => void;
  warn: (ILoggerParam) => void;
  verbose: (ILoggerParam) => void;
  debug: (ILoggerParam) => void;
}

interface ILoggerContextInfo {
  timestamp: string;
  processID: number;
}

export class Logger implements ILogger {
  private log: logConfig.Logger;
  private logDirectory: string = 'log';
  private directoryExists: boolean = fileSystem.existsSync(this.logDirectory);

  public constructor(log?: logConfig.Logger) {
    if (!this.directoryExists) {
      fileSystem.mkdirSync(this.logDirectory);
    }

    if (log !== undefined && log !== null) {
      this.log = log;
    } else {
      this.log = logConfig.createLogger({
        //each transport is a different directory to display or store a log
        //log levels follows npm format (error, warn, info, verbose, debug, silly)
        transports: [
          new logConfig.transports.Console({
            level: 'silly',
          }),
          new logConfig.transports.File({
            filename: `${this.logDirectory}/error.json`,
            level: 'error',
          }),
          new logConfig.transports.File({
            filename: `${this.logDirectory}/warn.json`,
            level: 'warn',
          }),
          new logConfig.transports.File({
            filename: `${this.logDirectory}/info.json`,
            level: 'info',
          }),
          new logConfig.transports.File({
            filename: `${this.logDirectory}/verbose.json`,
            level: 'verbose',
          }),
          new logConfig.transports.File({
            filename: `${this.logDirectory}/debug.json`,
            level: 'debug',
          }),
          new logConfig.transports.File({
            filename: `${this.logDirectory}/silly.json`,
            level: 'silly',
          }),
          //  This transports.http is to send the logs to our logging-system
          new logConfig.transports.Http({
            host: process.env.DOMAIN_LOGGING_SYSTEM,
            port: parseInt(process.env.PORT_LOGGING_SYSTEM, 10),
          }),
        ],
      });
    }
  }

  public debug(param: ILoggerParam): void {
    const context: ILoggerContextInfo = this.getContextInfo();
    this.log.debug(this.stringifyLog(param, context));
  }

  public error(param: ILoggerParam): void {
    const context: ILoggerContextInfo = this.getContextInfo();
    this.log.error(this.stringifyLog(param, context));
  }

  public info(param: ILoggerParam): void {
    const context: ILoggerContextInfo = this.getContextInfo();
    this.log.info(this.stringifyLog(param, context));
  }

  public silly(param: ILoggerParam): void {
    const context: ILoggerContextInfo = this.getContextInfo();
    this.log.silly(this.stringifyLog(param, context));
  }

  public verbose(param: ILoggerParam): void {
    const context: ILoggerContextInfo = this.getContextInfo();
    this.log.verbose(this.stringifyLog(param, context));
  }

  public warn(param: ILoggerParam): void {
    const context: ILoggerContextInfo = this.getContextInfo();
    this.log.warn(this.stringifyLog(param, context));
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
