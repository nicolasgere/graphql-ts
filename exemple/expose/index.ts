import * as  express from 'express';
import * as  graphqlHTTP from 'express-graphql';
import { root } from './../model/root';
import { graphqlTs } from './../../index';




const app = express();

graphqlTs.init(new root());

app.use('/graphql', graphqlHTTP({
  schema: graphqlTs.getSchema(),
  graphiql: true
}));

app.listen(4000)
console.log('Go to localhost:4000/graphql')
