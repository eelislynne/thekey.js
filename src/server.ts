import DB from "./classes/DB";
import Logger from "./classes/Logger";
require('./lib/Routes')

async function start() {
    try {
        console.log("Starting TheKey.js...");
        await DB.connect();
    } catch(e) {
        Logger.err(e)
    }
}

start().catch(e => Logger.err(e))