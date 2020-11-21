import DB from "../Classes/DB";
import response, { WebResponse } from "../Classes/Response";
import Route, { WebCallback } from "../Classes/Route";
import Util from "../Classes/Util";
import BaseController from "../Controllers/BaseController";

Route.set("/", async (req, params) => {
  const data = await DB.queryOne("SELECT * FROM players WHERE uid = 3");

  await DB.update(
    "players",
    {
      name: "testing",
    },
    "uid = ?",
    3
  );

  return response().string(Util.getGlientIP(req));
}, "GET");

Route.set("/author/:id/1", async (req, params) => {
  const id = params.id;
  
  const posts = await DB.query("SELECT id, title, description, content, date FROM posts WHERE author_id = ?", id);
  const author = await DB.queryOne("SELECT * FROM authors WHERE id = ?", id);

  return response().json({
    success: true,
    author,
    posts
  });
});

Route.set("/author/:id/2", async (req, params) => {
  const id = params.id;

  const [ posts, author ] = await Promise.all([
    DB.query("SELECT id, title, description, content, date FROM posts WHERE author_id = ?", id),
    DB.queryOne("SELECT * FROM authors WHERE id = ?", id)
  ]);

  return response().json({
    success: true,
    author,
    posts
  });
});

Route.set("/author/:id/3", async (req, params) => {
  const id = params.id;

  return response().json({
    success: true,
    author: {
      name: "Some boi"
    },
    posts: []
  });
});


async function middleware() {
  return false;
}

async function fail() {
  return {
    code: 403,
    data: "Middleware does not allow this"
  } as WebResponse;
}

Route.set("/mw/:test", async (req, params) => {
  return response(200).string(BaseController.helloWorld());
}, "GET", middleware, fail);
