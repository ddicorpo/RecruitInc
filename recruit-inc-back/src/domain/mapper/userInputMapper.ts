/**
 * We can use this Mapper to salt password, check permission before
 * deleting a user
 */
export class UserInputMapper {
  /**
   * Validate info and register user
   */
  public register(
    username: string,
    email: string,
    unhashedPwd: string,
    firstName,
    lastName: string
  ) {
    //TODO
  }

  public update() {
    //TODO
  }

  public delete() {
    //TODO
  }
}
