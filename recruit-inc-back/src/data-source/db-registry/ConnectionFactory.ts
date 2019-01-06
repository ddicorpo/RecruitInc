import { Connection } from './Connection';

export abstract class ConnectionFactory {
  abstract getConnection(): Connection;
  abstract defaultInitialization(): void;
}
