import {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLFloat,
    GraphQLList,
    GraphQLNonNull
} from 'graphql';

import * as helper from './src/helper';
import {fieldProcess} from './src/type/field';
import {mutationProcess} from './src/type/mutation';
import {inputProcess} from './src/type/input';
import * as metadata from './src/metadata';
import "reflect-metadata";

var models = {};
var mutations = { name: 'Mutation', fields:  {} };
var haveMutation = false;
var inputs = {};



export function field(target: any, key: string) {
    fieldProcess(target, key, models)
}

export module graphqlTs {
    export function getSchema() {
        var temp: any = {};
        temp.query = models['root'];
        if (haveMutation) temp.mutation = new GraphQLObjectType(mutations);
        return new GraphQLSchema(temp);
    }
}

export function required(name: [string]) {
    return metadata.required(name);
}
export function description(text: string) {
    return metadata.description(text);
}
export function returnType(name: string) {
    return metadata.returnType(name);
}
export function inputListType(name: string) {
    return metadata.inputListType(name);
}

export function mutation(target: any, key: string) {
    haveMutation = true;
    mutationProcess(target, key, models, mutations, inputs)
}

export function input(target: any, key: string) {
    inputProcess(target, key, models, inputs);
}
