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

export function fieldProcess(target: any, key: string, models:any) {
    helper.createIfObjectNotExist(target.constructor.name, models);
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
        if (returntype.name=="Array") {
            const tempType = models[key.slice(0, -1)] || models[metadata.getReturn(target,key)] || helper.getGraphQLType(metadata.getReturn(target,key));
            models[target.constructor.name]._typeConfig.fields[key] = {
                type: new GraphQLList(tempType),
                resolve: wrapFunction,
                description:metadata.getDescription(target,key),
                args: helper.convertArgsToGraphQL(args, argsRequired,null)
            }
        } else {
          var tempType = models[returntype.name] || helper.getGraphQLType(returntype.name)
          models[target.constructor.name]._typeConfig.fields[key] = {
              type:  metadata.getNullable(target,key) ? tempType : new GraphQLNonNull(tempType),
              resolve: wrapFunction,
              description:metadata.getDescription(target,key),
              args: helper.convertArgsToGraphQL(args, argsRequired, null)
          }
        }
    } else {
       models[target.constructor.name]._typeConfig.fields[key] = {
            type: metadata.getNullable(target,key) ? helper.getGraphQLType(typeInfo.name) : new GraphQLNonNull(helper.getGraphQLType(typeInfo.name)),
            description:metadata.getDescription(target,key)
        }
    }
}
