# GraphQL.ts
[![Build Status](https://travis-ci.org/nicolasgere/graphql-ts.svg?branch=dev)](https://travis-ci.org/nicolasgere/graphql-ts?branch=dev)
[![npm version](https://badge.fury.io/js/graphql-ts.svg)](https://badge.fury.io/js/graphql-ts)

The Typescrit implementation for GraphQL, a query language for APIs created by Facebook.
See specification here http://graphql.org/




## Getting Started

That package is currently in development and not ready for PRODUCTION. Graphql.ts use decorator and metadata for generate a graphql.js model. The why of this package is to provide a suger syntax for Typescript and use the power of the typings.
Feel free to contribute, any issues, pull request or stars are welcome.

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
import {field, objectType} from 'graphql-ts'

@objectType
class root{
  @field
  hello():string{
    return "world"
  }
}

//That is the entry point of the schema
graphqlTs.init(new root());
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
   return "world"
  }
}
graphqlTs.init(new root());

var queryString = '{ hello }';
graphqlTs.query(queryString).then(result => {

  // Prints
  // {
  //   data: { hello: "world" }
  // }
  console.log(result);

});
```
### Decorator
Graphql-ts work with decorator for annotate the code and then generate the model
+ <code><strong>@objectType</strong></code> create an object type with the class name as name
```ts
@objectType
class user{
  @field
  name:string
}
```

+ <code><strong>@inputType</strong></code> create an input object type with the class name as name
```ts
@inputType
class userInput{
    @field
    name:string
}
```
+ <code><strong>@scalarType</strong></code> create a scalar type, for more information about the scalar in graphql check [here](http://graphql.org/graphql-js/type/#graphqlscalartype)

```ts
@scalarType
export class DateQl {
    @field
    serialize(value: any) {
        //you're code here
    };
    @field
    parseValue(value: any) {
        //you're code here
    }
    @field
    parseLiteral(valueNode: any): any {
        //you're code here
    }
```
+ <code><strong>@field</strong></code> add the field in the model, if it's a function, that will be use a resolve 
```ts
@objectType
class user{
  @field
  name:string
  
  @field
  name:string
  
  @field
  fullName():string{
    return this.firstName + ' ' + this.lastName
  }
}
```

+ <code><strong>@description(name:string)</strong></code> add a description to the field or the object
```ts
@objectType
class user{
  @field  @description('The name of the user')
  name:string
}
```
+ <code><strong>@list</strong></code> same as field but return a list, for more information about the list in graphql check [here](http://graphql.org/graphql-js/type/#graphqllist)
+  <code><strong>@returnType(Type)</strong></code> Cause of lack in typescript about emit decorator for complexe object, when we returne an object<T>, Array<T> for exemple, we are not able to have the T type, so that's why we need to specify that T using the @returnType
```ts
@objectType
class user{
  @field  @description('The name of the user')
  name:string
  
  @list @returnType(Number)
  notes:number[]
  
  @list @returnType(user)
  friends():user[]{
    return dataUsers({friends:this.name});
   }
}
```

+ <code><strong>@required(['paramName'])</strong></code> set a params as required
```ts
@objectType @description('voila enfin le root')
export class root {
    @field @returnType(user) @required(['firstName'])
    user(firstName:string):user{
        return dataUsers({name:firstName}).firstOrDefault();
    }
}
```
+ <code><strong>@nullable(boolean)</strong></code> set a field or input nullable or not, by default is true
```ts
@inputType
export class userInput{
  @field //nullable is true by default
  firstName:string

  @field @nullable(false)
  lastName:string

  @list @returnType(String) @nullable(false)
  friends:string[]
}
```
+ <code><strong>@mutation</strong></code> create a mutation, see [here](http://graphql.org/graphql-js/mutations-and-input-types/) for more information
```ts
   @mutation
    addUser(userInput:userInput):user{
      let newUser = new user();
      dataUsers().push(<any>newUser);
      return  newUser;
    }
```

###More complex exemple

For more complexe case, check the [exemple](exemple/) folder.
```
