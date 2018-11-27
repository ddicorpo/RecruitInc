import * as mongoose from 'mongoose';
import { Connection } from '../Connection';
import { Logger } from '../../../Logger';

const logger = new Logger();
export class MongoConnection extends Connection {
  private options = {
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE,
    poolSize: 10,
  };
  constructor() {
    super();
  }

  public setDatabaseURL(databaseURL: string): void {
    this.databaseURL = databaseURL;
  }
  public setDatabaseName(databaseName: string): void {
    this.databaseName = databaseName;
  }
  public setDatabasePassword(databasePassword: string): void {
    this.databasePassword = databasePassword;
  }
  public setDatabasePort(databasePort: string): void {
    this.databasePort = databasePort;
  }
  public setDatabaseUser(databaseUser: string): void {
    this.databaseUser = databaseUser;
  }
  public setDatabaseOption(databaseOption: string): void {
    this.databaseOption = databaseOption;
  }

  protected getConnectionString(): string {
      //Production database does not have user or password
      if (process.env.NODE_ENV === 'production')
          return `${process.env.DB_HOST}/${process.env.DB_NAME}`
    const connectUrl: string =
      this.databaseURL +
      this.databaseUser +
      ':' +
      this.databasePassword +
      '@' +
      this.databaseName +
      this.databaseOption;
    // This constant is made to log the connection string without logging the password..
    const loggedUrl: string =
      this.databaseURL +
      this.databaseUser +
      ':' +
      '<PASSWORD>' +
      '@' +
      this.databaseName +
      this.databaseOption;
    logger.info({
      class: 'MongoConnection',
      method: 'getConnectionString',
      action: 'Connection String',
      params: {},
      value: { loggedUrl },
    });
    return connectUrl;
  }
  public buildConnection(): any {
    //Var db is part of MongoClient requirement
    var db = mongoose
      .connect(
        this.getConnectionString(),
        this.options
      )
      .then(() => {
        console.log('Connection to database established');
      })
      .catch(error => {
        console.log("Can't connect to database");
        logger.error({
          class: 'MongoConnection',
          method: 'buildConnection',
          action: 'Attempt to connect',
          params: {},
          value: error,
        });
      });

    return db;
  }

  /**
   * Always use this method for testing, otherwise connection are not close...
   */
  public buildConnectionTest(): any {
    //Var db is part of MongoClient requirement
    var db = mongoose
      .connect(
        this.getConnectionString(),
        this.options
      )
      .then(() => {
        console.log('Connection to database established');
        mongoose.connection.close();
      })
      .catch(error => {
        console.log("Can't connect to database, see log");
        logger.error({
          class: 'MongoConnection',
          method: 'buildConnectionTest',
          action: 'Attempt to connect',
          params: {},
          value: error,
        });
        mongoose.connection.close();
      });

    return db;
  }
}
