export default class Middleware {
  private userObj: object = null;
  private auth = false;

  public value(): object {
    return this.userObj;
  }

  public setValue(obj: object): void {
    this.userObj = obj;
  }

  public authorized(): boolean {
    return this.auth;
  }

  public setAuth(val: boolean): void {
    this.auth = val;
  }
}
