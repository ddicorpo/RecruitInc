import { MongoConnection } from './MongoConnection';
import { ConnectionFactory } from '../ConnectionFactory';

export class MongoConnectionFactory extends ConnectionFactory {
  private conn: MongoConnection;
  private testingContext: boolean;
  constructor(
    databaseURL: string = null,
    databasePassword: string = null,
    databasePort: string = null,
    databaseUser: string = null,
    databaseName: string = null,
    databaseOption: string = null,
    testingContext: boolean = false
  ) {
    super();
    this.conn = new MongoConnection();
    this.testingContext = testingContext;

    if (databaseURL != null) {
      this.conn.setDatabaseURL(databaseURL);
    }
    if (databasePassword != null) {
      this.conn.setDatabasePassword(databasePassword);
    }
    if (databasePort != null) {
      this.conn.setDatabasePort(databasePort);
    }
    if (databaseUser != null) {
      this.conn.setDatabaseUser(databaseUser);
    }
    if (databaseName != null) {
      this.conn.setDatabaseName(databaseName);
    }
    if (databaseOption != null) {
      this.conn.setDatabaseOption(databaseOption);
    }
  }
  public getConnection(): any {
    if (this.testingContext) {
      return this.conn.buildConnectionTest();
    } else {
      return this.conn.buildConnection();
    }
  }

  public defaultInitialization(): MongoConnection {
    this.conn = null;
    this.conn = new MongoConnection();
    return this.conn;
  }
}
