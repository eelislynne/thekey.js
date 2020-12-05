# thekey.js
TheKey.js is a TypeScript framework built with [Fastify](https://www.npmjs.com/package/fastify), which provides a backend database API and a set structure for writing controllers.

The name and structure of this framework is alike with [TheKey PHP](https://github.com/KieranHolroyd/TheKey).

* lib/Routes.ts: Sets all routes, their callbacks, methods and middleware.
* Controllers/: Location for all controllers, middlewares and services.
* Classes/*: Internal classes for TheKey, provides classes such as Util, Route and Response.


## Setting routes
In lib/Routes.ts use `Route.set` to add a new route. All the callbacks are async and should return a promise.

### Function
```javascript
Route.set(route, callback, methods, middleware, middlewareFail)
```

### Function's parameters
* `route<string>` = The requested url = '/login'
* `callback<function>` = The optional parameters are req, params, and middleware
* `methods<string or array>` = The requested method = 'ALL', 'GET', 'POST', etc..
<!--* `middleware<function>` = ? -->
<!--* `middlewareFail<function>` = ? -->

#### Middleware parameter
The middleware callback should return the "user" object (or just true).

The object returned from the callback can then be accessed from the middleware object passed in as the third argument to callback set with `Route.set`

```javascript
Route.set("/", (req, params, middleware) => {
    return response().json(middleware.user());
}, "ALL", middleware)
``` 


### Todo
* Add a non-static/object based API for DB 
