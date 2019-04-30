'use strict';

const Hapi = require('hapi');
const boom = require('boom');

const server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: 8000
});

server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        reply('hello hapi');
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

server.start(() => console.log('Server running on %s', server.info.uri));