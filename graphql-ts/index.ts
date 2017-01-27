import {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLFloat,
    GraphQLList,
    GraphQLNonNull
} from 'graphql';

import * as helper from './helper';
import "reflect-metadata";
var models = [];

const requiredMetadataKey = Symbol("required");
const returnMetadataKey = Symbol("return");

function createIfObjectNotExist(target:any){
  if (!models[target.constructor.name]) {
      models[target.constructor.name] = new GraphQLObjectType({
          name: target.constructor.name,
          fields: {}
      })
  }
}
function getArgs(target:any, key:any, params:any){
  return helper.$args(target[key]).map(function(item, i) {
      return { name: item, type: params[i].name };
  });
}
function convertArgsToGraphQL(args:any, argsRequired:any){
  var temp = {};
  args.forEach(function(item) {
      if(argsRequired.indexOf(item.name)!=-1){
        const type = helper.getGraphQLType(item.type)
        temp[item.name] = { "type": new GraphQLNonNull(type)};
      }else{
        temp[item.name] = { "type": helper.getGraphQLType(item.type)};
      }
  })
  return temp;
}

export function required(name:[string]){
  return Reflect.metadata(requiredMetadataKey, JSON.stringify(name));
}
export function returnType(name:string){
  return Reflect.metadata(returnMetadataKey, JSON.stringify(name));
}
function getReturn(target,key){
  return Reflect.getMetadata(returnMetadataKey, target, key).replace('"','').replace('"','');
}

function getRequired(target,key){
  const temp =  Reflect.getMetadata(requiredMetadataKey, target, key);
  if(temp){
    return JSON.parse(temp);
  }else{
    return [];
  }
}

export function field(target: any, key: string) {
    createIfObjectNotExist(target);
    const typeInfo = Reflect.getMetadata("design:type", target, key);
    if (typeInfo.name == "Function") {

        const params = Reflect.getMetadata("design:paramtypes", target, key);
        const returntype = Reflect.getMetadata("design:returntype", target, key);
        const args = getArgs(target,key, params);
        const argsRequired = getRequired(target,key);
        var wrapFunction = function(_:any, data:any) {
            var paramsTemp = args.map(function(item){
              return data[item.name] ? data[item.name] : undefined;
            })
            return target[key].apply(_,paramsTemp);
        }
        if (returntype.name=="Array") {

            const tempType = models[key.slice(0, -1)] || models[getReturn(target,key)] || helper.getGraphQLType(getReturn(target,key));
            console.log(tempType);
            models[target.constructor.name]._typeConfig.fields[key] = {
                type: new GraphQLList(tempType),
                resolve: wrapFunction,
                args: convertArgsToGraphQL(args, argsRequired)
            }
        } else {
          models[target.constructor.name]._typeConfig.fields[key] = {
              type: models[returntype.name] || helper.getGraphQLType(returntype.name),
              resolve: wrapFunction,
              args: convertArgsToGraphQL(args, argsRequired)
          }
        }
    } else {
        models[target.constructor.name]._typeConfig.fields[key] = {
            type: helper.getGraphQLType(typeInfo.name),
        }
    }
}

export function query(query: string) {
    var schema = new GraphQLSchema({
        query: models['root']
    });

    return graphql(schema, query);
}
