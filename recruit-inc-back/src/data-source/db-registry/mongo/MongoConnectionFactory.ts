import { MongoConnection } from './MongoConnection';
import { ConnectionFactory } from '../ConnectionFactory';

export class MongoConnectionFactory extends ConnectionFactory {
  private conn: MongoConnection;
  private testingContext: boolean;
  constructor(
    databaseURI: string = null,
    databaseName: string = null,
    testingContext: boolean = false
  ) {
    super();
    this.conn = new MongoConnection();
    this.testingContext = testingContext;

    if (databaseURI != null) {
      this.conn.setDatabaseURI(databaseURI);
    }
    if (databaseName != null) {
      this.conn.setDatabaseName(databaseName);
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
    this.conn = new MongoConnection();
    return this.conn;
  }
}
