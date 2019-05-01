'use strict';

const Hapi = require('@hapi/hapi');
const boom = require('@hapi/boom');
const inert = require('@hapi/inert');
const vision = require('@hapi/vision');
const handlebars = require('handlebars');

const init = async () => {

    const server = Hapi.server({
        host: 'localhost',
        port: 8000
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return h.response('Hello, Hapi')
            //.code(204)
                .type('text/plain')
                .header('header-key', 'header-value')
                .state('cookie-key', 'cookie-value');
        }
    });

    server.route({
        method: 'GET',
        path: '/user/{name?}',
        handler: (request, h) => {
            const user = request.params.name;
            if(user) {
                return `Hello, ${user}`;
            } else {
                return boom.badRequest('user name is required');
            }
        }
    });

    await server.register(inert);

    server.route({
        method: 'GET',
        path: '/{filename*}',
        handler: {
            directory: {
                path: 'images'
            }
        }
    });

    await server.register(vision);

    server.views({
        engines: {
            hbs: handlebars
        },
        //relativeTo: __dirname,
        layout: true,
        path: 'views'
    });

    server.route({
        method: 'GET',
        path: '/view/{name?}',
        handler: (request, h) => {
            return h.view('root', {name: request.params.name || 'guest'});
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

init();