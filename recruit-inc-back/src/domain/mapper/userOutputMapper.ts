export class UserOutputMapper {
  /**
   * Remove hashed password from return value
   */
  public getAllUsers() {
    //TODO
  }

  /**
   * Login a user, return true if success/false otherwise
   * @param username
   * @param hashedPass
   */
  public loginWithUsername(username: string, hashedPass: string) {
    //TODO
  }

  public loginWithEmail(mail: string, hashedPass: string) {
    //TODO
  }

  /**
   * Return user without the hashed Password
   * @param mail
   */
  public findUserByEmail(mail: string) {
    //TODO
  }
}
