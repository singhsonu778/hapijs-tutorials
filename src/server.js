'use strict';

const Hapi = require('hapi');
const boom = require('boom');
const inert = require('inert');

const server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: 8000
});

server.register(inert, () => {
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, reply) => {
            reply('hello hapi')
                .code(204)
                .type('text/plain')
                .header('header-key', 'header-value')
                .state('cookie-key', 'cookie-value');
        }
    });

    server.route({
        method: 'GET',
        path: '/user/{name?}',
        handler: (request, reply) => {
            const user = request.params.name;
            if(user) {
                reply(`hello ${user}`);
            } else {
                reply(boom.badRequest('user name is required'))
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/{filename}',
        handler: {
            directory: {
                path: 'images'
            }
        }
    });

    server.start(() => console.log('Server running on %s', server.info.uri));
});

