import { FastifyRequest } from "fastify";

export default class Request {
  private req;
  constructor(req: FastifyRequest) {
    this.req = req;
  }

  public input(name: string) {
    if (this.req.method.toLowerCase() === "get") {
      return this.inputGet(name);
    }

    const value = this.inputPost(name);
    return value === null ? this.inputGet(name) : value;
  }

  public inputGet(name: string) {
    return (this.req.query as any)[name] || null;
  }

  public inputPost(name: string) {
    return (this.req.body as any)[name] || null;
  }

  public inputSpecial(name: string) {
    return (this.req.body as any)[name] || null;
  }
}
