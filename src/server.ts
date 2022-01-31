import DB from "./Classes/DB.js";
import InitRoutes from "./lib/Routes.js";

console.log("Starting TheKey.js...");

DB.connect();

InitRoutes();
