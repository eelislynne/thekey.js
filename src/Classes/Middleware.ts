export default class Middleware {
  private userObj: object = null;
  private auth = false;

  public user(): object {
    return this.userObj;
  }

  public setUser(obj: object): void {
    this.userObj = obj;
  }

  public authorized(): boolean {
    return this.auth;
  }

  public setAuth(val: boolean): void {
    this.auth = val;
  }
}
