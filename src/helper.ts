import {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLFloat,
    GraphQLBoolean,
    GraphQLNonNull,
    GraphQLList,
    GraphQLInputObjectType
} from 'graphql';

import {getDescription} from './metadata'



export function $args(func) {
    return (func + '')
        .replace(/[/][/].*$/mg, '') // strip single-line comments
        .replace(/\s+/g, '') // strip white space
        .replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments
        .split('){', 1)[0].replace(/^[^(]*[(]/, '') // extract the parameters
        //.replace(/=[^,]+/g, '') // strip any ES6 defaults
        .split(',').filter(Boolean); // split & filter [""]
}
export function getGraphQLType(type: string):any {
    type = type.toLowerCase();
    if (type == "string" ) {
        return GraphQLString
    }
    if (type == "number") {
        return GraphQLFloat
    }
    if (type == "boolean") {
        return GraphQLBoolean
    }
}

export function createIfObjectNotExist(target:any, obj:any){
  if (!obj[target.constructor.name]) {
      obj[target.constructor.name] = new GraphQLObjectType({
          name: target.constructor.name,
          fields: {}
      })
  }
}
export function createInputObjectIfNotExist(target:any, obj:any){
  if (!obj[target.constructor.name]) {
      obj[target.constructor.name] = new GraphQLInputObjectType({
          name: target.constructor.name,
          fields: {}
      })
  }
}
export function getArgs(target:any, key:any, params:any){
  return $args(target[key]).map(function(item, i) {
      return { name: item, type: params[i].name };
  });
}
export function convertArgsToGraphQL(args:any, argsRequired:any, inputs:any){
  var temp = {};
  args.forEach(function(item) {
        let type = getGraphQLType(item.type)
        if(!type){
          type = inputs[item.type];
        }
      if(argsRequired.indexOf(item.name)!=-1){
        temp[item.name] = { "type": new GraphQLNonNull(type)};
      }else{
        temp[item.name] = { "type": type};
      }
  })
  return temp;
}
