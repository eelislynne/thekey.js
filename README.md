# thekey.js
TheKey.js is a TypeScript framework built on top of Fastify, which provides a database API and a standardized way of writing controllers.

The name and structure of this framework is shared with [TheKey PHP version](https://github.com/KieranHolroyd/TheKey). This framework is meant as a backend API server.

* lib/Routes.ts: Sets all routes, their callbacks, methods and middleware.
* Controllers/: Location for all controllers, middlewares and services.
* Classes/*: Internal classes for TheKey, provides classes such as Util, Route and Response.


## Setting routes

Use Route.set to add a new route. All the callbacks are async and should return a promise.

```javascript
Route.set(route, callback, methods, middleware, middlewareFail)
``` 


## Middleware

The middleware callback should return the "user" object (or just true). The object returned from the callback can then be accessed from the middleware object passed in as the third argument to callback set with `Route.set`
```javascript
Route.set("/", (req, params, middleware) => {
    return response().json(middleware.user());
}, "ALL", middleware)
``` 


### Todo
* Add a non-static/object based API for DB 
