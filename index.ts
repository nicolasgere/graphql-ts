import  {field, graphqlTs} from  './graphql-ts/index'
import * as express from 'express'
import * as graphqlHTTP from 'express-graphql'

import {root} from './model/model'

var test = new root()





const app = express();

app.use('/graphql', graphqlHTTP({
  schema: graphqlTs.getSchema(),
  graphiql: true
}));

app.listen(4000);