export default class Middleware {
  private userObj: any = null;
  private auth: boolean = false;

  public user() {
    return this.userObj;
  }

  public setUser(obj: any) {
    this.userObj = obj;
  }

  public authorized() {
    return this.auth;
  }

  public setAuth(val: boolean) {
    this.auth = val;
  }
}
