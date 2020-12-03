import DB from "../Classes/DB";
import response, { WebResponse } from "../Classes/Response";
import Route from "../Classes/Route";
import Util from "../Classes/Util";
import BaseController from "../Controllers/BaseController";

Route.set("/", async (req, params) => {

  return response().string("hello world");
}, "GET");

async function middleware() {
  return {
    username: "Username123"
  };
}

async function fail() {
  return {
    code: 403,
    data: "Middleware does not allow this"
  } as WebResponse;
}

Route.set("/mw/:test", async (req, params, middleware) => {
  return response(200).json(middleware.user());
}, "GET", middleware, fail);
