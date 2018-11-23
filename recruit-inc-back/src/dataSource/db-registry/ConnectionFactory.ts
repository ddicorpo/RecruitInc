abstract class ConnectionFactory {
  abstract getConnection(): IConnection;
  abstract defaultInitialization(): void;
}
