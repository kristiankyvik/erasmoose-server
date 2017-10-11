'use strict'; // eslint-disable-line strict

require('babel-core/register');
require('babel-polyfill');

// Connect to database
// const mongoUtil = require('./mongoUtil');
// mongoUtil.getCollection('setup');

// Import Graphsql utils
import { makeExecutableSchema } from 'graphql-tools';
import { schema } from './schema';
import { resolvers } from './resolvers';

const server = require('apollo-server-lambda');

const myGraphQLSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
  logger: console,
});

exports.graphqlHandler = function graphqlHandler(event, context, callback) {
  function callbackFilter(error, output) {
    // eslint-disable-next-line no-param-reassign
    output.headers['Access-Control-Allow-Origin'] = '*';
    callback(error, output);
  }

  const handler = server.graphqlLambda({ schema: myGraphQLSchema });
  return handler(event, context, callbackFilter);
};

// for local endpointURL is /graphql and for prod it is /stage/graphql
exports.graphiqlHandler = server.graphiqlLambda({ endpointURL: process.env.GRAPHQL_ENDPOINT ? process.env.GRAPHQL_ENDPOINT : '/production/graphql' });
