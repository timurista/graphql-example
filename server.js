const express = require('express');
// glue between graphql and express
// convention is saved as GraphQL
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');

const app = express();
// any route, graphql, then let it handle it

// need middleware
// modify requests as they come in through the server
// and we need schema
app.use('/graphql', expressGraphQL({
    schema,
    // dev tool to use against server
    graphiql: true
}))

app.listen(4000, () => {
    console.log('Listening');
});

// is graphql?
// then sends to graphql
// then sends response to express
// one small portion inside express

// Combinig data
// db base approached
// and also http request to some remote API


// looking for user 23, async request
// graphql will wait for reques to resolve, then send back to graphical client
// almost always have to return a promise from resolve function


/**
 * Just added NODEMON to watch server for changes
 * which is server.js
 */