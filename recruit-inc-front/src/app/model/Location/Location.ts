export class Location {
  name: string;
  numberOfUsers: number;
  scannedUsers: number;

  constructor(name: string, numberOfUsers: number, scannedUsers: number) {
    this.name = name;
    this.numberOfUsers = numberOfUsers;
    this.scannedUsers = scannedUsers;
  }
}
