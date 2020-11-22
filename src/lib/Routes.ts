import DB from "../classes/DB";
import response, { WebResponse } from "../classes/Response";
import Route from "../classes/Route";
import Util from "../classes/Util";
import BaseController from "../controllers/BaseController";

Route.set("/", async (req) => {
  return response().json({
    "req_ip": Util.getClientIP(req),
    "success": true
  });
}, "GET");

async function middleware() {
  return false;
}

async function fail() {
  return {
    code: 403,
    data: {error: "Unauthorised", message: "Please Login or ask your administrator for permissions to this page."}
  };
}

Route.set("/mw/:test", async () => {
  return response(200).string(BaseController.helloWorld());
}, "GET", middleware, fail);
