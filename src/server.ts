import DB from "./Classes/DB";

console.log("Starting TheKey.js...");

DB.connect();

require('./lib/Routes');