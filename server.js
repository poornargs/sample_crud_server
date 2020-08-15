'use strict';
require('dotenv').config()
const Hapi = require('@hapi/hapi')
const config = require('./config')
const routesArray = require('./controllers/routes');
const app = {}
app.config = config
const init = async () => {
    const server = Hapi.server({
        port: app.config.server.port,
        host: app.config.server.host,
        routes: {
        cors: {
            origin: ['*'],
        }
    }
    });
    for (const row of routesArray) {
        server.route(row)
    }
    await server.start();
    console.log('server running on %s', server.info.uri);
}
process.on('unhadeledrejection', (err) => {
    console.log(err);
    process.exit(1)
})
init();
