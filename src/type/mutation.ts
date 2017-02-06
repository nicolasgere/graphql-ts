import * as helper from './../helper';
import * as metadata from './../metadata';
import "reflect-metadata";
import {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLFloat,
    GraphQLList,
    GraphQLNonNull
} from 'graphql';

export function mutationProcess(target: any, key: string, models:any, mutations:any, inputs:any) {
    const typeInfo = Reflect.getMetadata("design:type", target, key);
    if (typeInfo.name == "Function") {
        const params = Reflect.getMetadata("design:paramtypes", target, key);
        const returntype = Reflect.getMetadata("design:returntype", target, key);
        const args = helper.getArgs(target,key, params);
        const argsRequired = metadata.getRequired(target,key);
        var wrapFunction = function(_:any, data:any) {
            var paramsTemp = args.map(function(item){
              return data[item.name] ? data[item.name] : undefined;
            })
            return target[key].apply(_,paramsTemp);
        }
        if(!returntype) throw new Error('A mutation must have a valid return type');
        if (returntype.name=="Array") {
            const tempType = models[key.slice(0, -1)] || models[metadata.getReturn(target,key)] || helper.getGraphQLType(metadata.getReturn(target,key));
            mutations.fields[key] = {
                type: new GraphQLList(tempType),
                resolve: wrapFunction,
                description:metadata.getDescription(target,key),
                args: helper.convertArgsToGraphQL(args, argsRequired, inputs)
            }
        } else {
          mutations.fields[key] = {
              type: models[returntype.name] || helper.getGraphQLType(returntype.name),
              resolve: wrapFunction,
              description:metadata.getDescription(target,key),
              args: helper.convertArgsToGraphQL(args, argsRequired, inputs)
          }
        }
    }
}
