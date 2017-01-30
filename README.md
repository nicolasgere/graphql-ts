# GraphQL.ts
[![Build Status](https://travis-ci.org/nicolasgere/graphql-ts.svg?branch=dev)](https://travis-ci.org/nicolasgere/graphql-ts?branch=dev)

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


Then, serve the result of a query against that schema.

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
### Decorator
Graphql-ts work with decorator for annotate the code and then generate the model

+ <code><strong>@field</strong></code> add the field in the model, the object will be create with the class name. If it's a function, this will be the resolve
+ <code><strong>@description(name:string)</strong></code> add a description to the field
+ <code><strong>@required(['paramName'])</strong></code> no other way for the moment to set a params as non null
+ <code><strong>@returnType('typeName')</strong></code> return type of the resolve, this is need only for the array, for exemple if you want to return [string], the decorator will be @returnType('string')
+ <code><strong>@mutation</strong></code> create a mutation
+ <code><strong>@input</strong></code> equivalent of @field but for inputType
+ <code><strong>@inputListType('typeName')</strong></code> set the type of an array for an input field

###More complex exemple

```ts
import {field, graphqlTs, description, returnType, mutation, required} from 'graphql-ts'

class user{
  @field
  name:string

  @field
  age:number

  @mutation @required(['name','age'])
  user_update_age(name:string,age:number):string{
    db.update({"name":name},{$set:{"age":age}})
    return "ok";
  }
}

class root{
  @description('List of all users')
  @field  @returnType('user')
  users():Array<user>{
    return db.user.find();
  }
}
```

