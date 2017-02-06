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

export function objectTypeProcess(target: any, models:any) {
    helper.createIfObjectNotExist(target.name, models,metadata.getDescription(target));
}
