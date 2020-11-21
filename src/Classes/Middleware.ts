export default class Middleware {
  private static userObj: any = null;
  private static auth: boolean = false;

  public static user() {
    return this.userObj;
  }

  public static setUser(obj: any) {
    this.userObj = obj;
  }

  public static authorized() {
    return this.auth;
  }

  public static setAuth(val: boolean) {
    this.auth = val;
  }
}
