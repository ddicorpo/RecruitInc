import * as mongoose from 'mongoose';
import { Connection } from '../Connection';
import { Logger } from '../../../Logger';

const logger = new Logger();
export class MongoConnection extends Connection {
  private logger: Logger;
  private options = {
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE,
    poolSize: 10,
  };
  constructor() {
    super();
    this.logger = new Logger();
  }

  public setDatabaseURI(databaseURI: string): void {
    this.databaseURI = databaseURI;
  }
  public setDatabaseName(databaseName: string): void {
    this.databaseName = databaseName;
  }

  protected getConnectionString(): string {
    //Production database does not have user or password
    if (process.env.NODE_ENV === 'production')
      return `${process.env.DB_HOST}/${process.env.DB_NAME}`;
    const connectUrl: string =
      this.databaseURI +
      '/' +
      this.databaseName +
      logger.info({
        class: 'MongoConnection',
        method: 'getConnectionString',
        action: 'Connection String ',
        params: {},
        value: {},
      });

    return connectUrl;
  }
  public buildConnection(): any {
    //Var db is part of MongoClient requirement
    var db = mongoose
      .connect(
        'mongodb://abada:777deltaRouge$@68.183.196.227:27017/admin',
        this.options
      )
      .then(() => {
        console.log('Connection to database established');
        this.logAction(this.buildConnection.name, 'Connection Established');
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
    //if connection is ready/not open
    if (mongoose.connection.readyState === 0) {
      return this.buildConnectionObj();
    } else {
      // Close connection
      this.closeConnection();
      return this.buildConnectionObj();
    }
  }

  public closeConnection(): any {
    try {
      mongoose.disconnect();
      this.logAction(this.closeConnection.name, 'Disconnection successful');
    } catch (Exception) {
      console.log("Can't close connection");
      logger.error({
        class: 'MongoConnection',
        method: this.closeConnection.name,
        action: 'Attempt to disconnect',
        params: {},
        value: Exception,
      });
    }
  }
  private buildConnectionObj(): any {
    const connectionString: string = this.getConnectionString();
    console.log(
      '****************************** URL **********************************'
    );
    console.log(connectionString);

    var tmpConn = mongoose
      .connect(
        connectionString,
        this.options
      )
      .then(() => {
        this.logAction(this.buildConnectionObj.name, 'Connection Established');
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

    return tmpConn;
  }

  private logAction(methodName: string, message: string): void {
    this.logger.info({
      class: 'MongoConnections',
      method: methodName,
      action: message,
      params: {},
    });
  }
}
