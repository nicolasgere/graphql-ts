import * as  express from 'express';
import * as  graphqlHTTP from 'express-graphql';
import { schema } from './../model/root';



const app = express();

app.use('/graphql', graphqlHTTP({
  schema: schema(),
  graphiql: true
}));

app.listen(4000)
console.log('Go to localhost:4000/graphql')
