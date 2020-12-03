import fastify, { FastifyReply, FastifyRequest } from "fastify";
import Environment from "../environment";
import Middleware from "./Middleware";
import { WebResponse } from "./Response";

const server = fastify();
server.register(require("fastify-formbody"));
server.register(require("fastify-static"), {
  root: require("path").join(__dirname, "../../Public"),
  prefix: "/public/",
});

export interface WebCallback {
  (req: FastifyRequest, params: any, middleware: Middleware): Promise<WebResponse>;
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
      const meth = method.toLowerCase();
      if (meth === "get") {
        server.get(route, handle);
      } else if (meth === "post") {
        server.post(route, handle);

        server.options(route, (req, res) => {
          res.code(200).send();
        });
      } else if (meth === "put") {
        server.put(route, handle);
      } else if (meth === "delete") {
        server.delete(route, handle);
      } else if (meth === "patch") {
        server.patch(route, handle);
      } else if (meth === "options") {
        server.options(route, handle);
      } else {
        server.all(route, handle);
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
      const middle = new Middleware();
      if (middleware.length) {
        for (const mw of middleware) {
          const user = await mw(req, req.params as any);
          if (!user) {
            if (mwFail) {
              this.convertResponse(res, await mwFail(req, req.params as any, middle));
            } else {
              res.code(403).send({
                success: false,
                code: 403,
                message: "Forbidden (MW)",
              });
            }
            return;
          } else {
            middle.setAuth(true);
            if (typeof user === "object") {
              middle.setUser(user);
            }
          }
        }
      }
      this.convertResponse(res, await cb(req, req.params as any, middle));
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
    if (this.initialized) return;
    this.initialized = true;
    server.listen(Environment.port, (err) => {
      if (err) {
        console.log("error starting listener:", err);
        return;
      }
      console.log("TheKey listening on port", Environment.port);
    });
  }
}
