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

export function inputProcess(target: any, key: string, models,inputs:any) {
    helper.createInputObjectIfNotExist(target, inputs);
    const typeInfo = Reflect.getMetadata("design:type", target, key);
    if (typeInfo.name == "Function") throw new Error('An input type cannot be a function')
    if (typeInfo.name != "Array") {
        inputs[target.constructor.name]._typeConfig.fields[key] = {
            type: helper.getGraphQLType(typeInfo.name),
        }
    }
    if(typeInfo.name == "Array"){
        const inputType = metadata.getInput(target,key);
        if(!inputType) throw new Error('At this time, because of medata lack, you have to use @returnType for a list return type');
        inputs[target.constructor.name]._typeConfig.fields[key] = {
            type: new GraphQLList(inputs[inputType] || helper.getGraphQLType(inputType)),
        }
    }
}