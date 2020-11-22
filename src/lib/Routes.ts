import DB from "../classes/DB";
import response, { WebResponse } from "../classes/Response";
import Route from "../classes/Route";
import Util from "../classes/Util";
import BaseController from "../controllers/BaseController";

Route.set("/", async (req) => {

  await DB.update(
    "players",
    {
      name: "testing",
    },
    "uid = ?",
    3
  );

  return response().json({
    "req_ip": Util.getGlientIP(req),
    "success": true
  });
}, "GET");

async function middleware() {
  return false;
}

async function fail() {
  return {
    code: 403,
    data: "Middleware does not allow this"
  } as WebResponse;
}

Route.set("/mw/:test", async () => {
  return response(200).string(BaseController.helloWorld());
}, "GET", middleware, fail);
