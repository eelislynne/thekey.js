import fastify, { FastifyReply, FastifyRequest } from "fastify";
import Environment from "../environment";
import Middleware from "./Middleware";
import { WebResponse } from "./Response";
import Logger from "./Logger";

const server = fastify();
server.register(require("fastify-formbody"));
server.register(require("fastify-static"), {
  root: require("path").join(__dirname, "../../Public"),
  prefix: "/public/",
});

export interface WebCallback {
  (req: FastifyRequest, params: any): Promise<WebResponse>;
}
export interface MiddlewareCallback {
  (req: FastifyRequest, params: any): Promise<object | boolean>;
}

type ReqMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "ALL";

export default class Route {
  private static initialized = false;

  static set(
    route: string,
    callback: WebCallback,
    methods: ReqMethod | ReqMethod[] = "GET",
    middleware: MiddlewareCallback | MiddlewareCallback[] = null,
    mwFail: WebCallback = null
  ) {
    if (!Array.isArray(methods)) {
      methods = [methods];
    }
    if (!Array.isArray(middleware)) {
      middleware = middleware ? [middleware] : [];
    }
    const handle = this.handle(callback, middleware, mwFail);

    for (const method of methods) {
      switch(method.toLowerCase()) {
        case "get":
          server.get(route, handle);
        case "post":
          server.post(route, handle);
          server.options(route, (_, res) => {res.code(200).send()});
        break;
        case "put":
          server.put(route, handle)
        case "delete":
          server.delete(route, handle)
        case "patch":
          server.patch(route, handle)
        case "options":
          server.options(route, handle)
        default:
          server.all(route, handle)
      }
    }

    this.init();
  }

  private static handle(
    cb: WebCallback,
    middleware: MiddlewareCallback[],
    mwFail: WebCallback
  ) {
    return async (req: FastifyRequest, res: FastifyReply) => {
      if (middleware.length) {
        for (const mw of middleware) {
          const user = await mw(req, req.params as any);
          if (!user) {
            if (mwFail) {
              this.convertResponse(res, await mwFail(req, req.params as any));
            } else {
              res.code(403).send({
                success: false,
                code: 403,
                message: "Forbidden (MW)",
              });
            }
            return;
          } else {
            Middleware.setAuth(true);
            if (typeof user === "object") {
              Middleware.setUser(user);
            }
          }
        }
      }
      this.convertResponse(res, await cb(req, req.params as any));
    };
  }

  private static convertResponse(res: FastifyReply, response: WebResponse) {
    if (response.redirect) {
      res.redirect(response.code, response.redirect).send();
      return;
    }
    res.code(response.code || 200).send(response.data);
  }

  private static init() {
    if (!this.initialized) {
      this.initialized = true;
      server.listen(Environment.port, (err) => {
        if (err) return Logger.err(`error starting listener ${err}`);
        Logger.out(`web server listening on ${Environment.url}:${Environment.port}`);
      });
    }
  }
}
