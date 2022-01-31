/* eslint-disable @typescript-eslint/no-var-requires */
import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { FastifySSEPlugin } from "fastify-sse-v2";
import Environment from "../environment.js";
import Middleware from "./Middleware.js";
import { WebResponse } from "./Response.js";
import formBodyPlugin from "fastify-formbody";
import fastifyStatic from "fastify-static";
import fastifyCors from "fastify-cors";
import fastifyCookie from "fastify-cookie";
import * as path from "path";

const server = fastify();
const __dirname = path.resolve();

server.register(FastifySSEPlugin);
server.register(formBodyPlugin);
server.register(fastifyStatic, {
  root: path.join(__dirname, "../../Public"),
  prefix: "/public/",
});
server.register(fastifyCors, {
  credentials: true,
  origin: true,
});
server.register(fastifyCookie, {
  secret: "apax-hosting-cookies69",
});

server.addContentTypeParser(
  "application/json",
  { parseAs: "string" },
  function (req, body, done) {
    try {
      const json = JSON.parse(body as string);
      done(null, json);
    } catch (err) {
      err.statusCode = 400;
      done(err, undefined);
    }
  }
);

export interface WebCallback {
  (
    req: FastifyRequest,
    params: object,
    middleware: Middleware,
    response: FastifyReply
  ): Promise<WebResponse>;
}
export interface MiddlewareCallback {
  (req: FastifyRequest, params: object): Promise<object | boolean>;
}

type ReqMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "OPTIONS"
  | "ALL";

export default class Route {
  private static initialized = false;

  static set(
    route: string,
    callback: WebCallback,
    methods: ReqMethod | ReqMethod[] = "GET",
    middleware: MiddlewareCallback | MiddlewareCallback[] = null,
    mwFail: WebCallback = null
  ): void {
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
          const user = await mw(req, req.params as object);
          if (!user) {
            if (mwFail) {
              this.convertResponse(
                res,
                await mwFail(req, req.params as object, middle, res)
              );
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
              middle.setValue(user);
            }
          }
        }
      }
      this.convertResponse(
        res,
        await cb(req, req.params as object, middle, res)
      );
    };
  }

  private static convertResponse(res: FastifyReply, response: WebResponse) {
    if (response === null) return;
    if (response.redirect) {
      res.redirect(response.code, response.redirect).send();
      return;
    }
    // raw buffers, application/octet-stream, etc
    if (response.type) {
      res.type(response.type);
      res.send(response.data);
      return;
    }
    res.code(response.code || 200).send(response.data);
  }

  private static init() {
    if (this.initialized) return;
    this.initialized = true;
    server.listen(Environment.ports.web_server, Environment.ipv4, (err) => {
      if (err) {
        console.log("error starting listener:", err);
        return;
      }
      console.log("TheKey listening on port", Environment.ports.web_server);
    });
  }
}
