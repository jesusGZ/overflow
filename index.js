'use strict'

const Hapi = require('@hapi/hapi');
const handlerbars = require('handlebars');
const inert = require('inert');
const path = require('path');
const routes = require('./routes');
const site = require('./controllers/site');
const vision = require('vision');

const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    routes: {
        files: {
            relativeTo: path.join(__dirname, 'public')
        }
    }
});

async function init(){

    try {
        await server.register(inert)
        await server.register(vision)

        server.state('user', {
            ttl: 1000 * 60 * 24 * 7,
            isSecure: process.env.NODE_ENV === 'prod',
            encoding: 'base64json'
        })

        server.views({
            engines: {
                hbs: handlerbars
            },
            relativeTo: __dirname,
            path: 'views',
            layout: true,
            layoutPath: 'views'
        })

        server.ext('onPreResponse', site.fileNotFound)
        server.route(routes)
        await server.start()
    } catch (error) {
        console.error(error);
        process.exit(1);
    }

    console.log(`Servidor lanzado en: ${server.info.uri}`);
}

process.on('unhandledRejection', error => {
    console.error('UnhandledRejection: ', error.message);
})

process.on('unhandledException', error => {
    console.error('UnhandledRejection: ', error.message);
})

init();