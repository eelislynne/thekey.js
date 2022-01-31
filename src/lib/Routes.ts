import DB from "../Classes/DB.js";
import response, { WebResponse } from "../Classes/Response.js";
import Route from "../Classes/Route.js";

export default function InitRoutes() {
  Route.set(
    "/",
    async () => {
      DB.update(
        "testtable",
        {
          year: 2000,
          boi: true,
        },
        "id = ?",
        50
      );

      return response().string("hello world");
    },
    "GET"
  );

  async function middleware() {
    return false;
  }

  async function fail() {
    return {
      code: 403,
      data: "Middleware does not allow this",
    } as WebResponse;
  }

  Route.set(
    "/mw/:test",
    async (req, params, middleware) => {
      return response(200).json(middleware.value());
    },
    "GET",
    middleware,
    fail
  );
}
