# GraphQL.ts

The Typescrit implementation for GraphQL, a query language for APIs created by Facebook.




## Getting Started

That package is currently in development and not ready for production. Graphql.ts use decorator and metadata for generate a graphql.js model. The why of this package is to provide a suger syntax for Typescript and use the power of the typings

### Using GraphQL.ts

Install GraphQL.ts from npm

```sh
npm install --save graphql-ts
```

We use reflect-metadata for have type at the runtime, so we need to pass some parameters to the compilator

```js
"compilerOptions": {
       "module": "commonjs",
       "target": "es6",
       "emitDecoratorMetadata": true,
       "experimentalDecorators": true,
   }
```



GraphQL.ts provides the capabilities to build the schema. This schema will be interprated by GraphQL.js

First, build a GraphQL type schema which maps to your code base.

```ts
import {field} from 'graphql-ts'

class root{
  @field
  hello():string{
    return "world"
  }
}
```
This code will generate at the runtime the equivalent  model

```js
import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: GraphQLString,
        resolve() {
          return 'world';
        }
      }
    }
  })
});
```


Then, serve the result of a query against that type schema.

```ts
import {graphqlTs} from 'graphql-ts'
import {graphql} from 'graphql'

class root{
  @field
  hello():string{
  }
}
graphqlTs.init(root);

var query = '{ hello }';
graphql(graphqlTs.getSchema(), query).then(result => {

  // Prints
  // {
  //   data: { hello: "world" }
  // }
  console.log(result);

});
```
