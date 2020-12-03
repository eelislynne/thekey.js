import { FastifyRequest } from 'fastify';

export default class Request {
  private req;
  constructor(req: FastifyRequest) {
    this.req = req;
  }

  public input(name: string): string | string[] {
    if (this.req.method.toLowerCase() === 'get') {
      return this.inputGet(name);
    }

    const value = this.inputPost(name);
    return value === null ? this.inputGet(name) : value;
  }

  public inputGet(name: string): string | string[] {
    return (this.req.query as Record<string, string | string[]>)[name] || null;
  }

  public inputPost(name: string): string | string[] {
    return (this.req.body as Record<string, string | string[]>)[name] || null;
  }

  public inputSpecial(name: string): unknown {
    return (this.req.body as Record<string, unknown>)[name] || null;
  }
}
