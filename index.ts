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
import {listProcess} from './src/type/list';
import {mutationProcess} from './src/type/mutation';
import {objectTypeProcess} from './src/type/objectType';

import {inputProcess} from './src/type/input';
import * as metadata from './src/metadata';
import "reflect-metadata";

var models = {};
var mutations = { name: 'Mutation', fields:  {} };
var haveMutation = false;
var inputs = {};

var entryQuery = '';
var entryMutation = '';



export function objectType(target: any) {
    objectTypeProcess(target,models);
}



export function field(target: any, key: string) {
    fieldProcess(target, key, models)
}

export function list(target: any, key: string) {
    listProcess(target, key, models)
}


export module graphqlTs {
    export function getSchema() {
        var schema: any = {};
        if(!entryQuery) {
          throw new Error('You have to init the root query object')
        }

        schema.query = models[entryQuery];
        if (haveMutation) schema.mutation = new GraphQLObjectType(mutations);
        return new GraphQLSchema(schema);
    }
    export function init<T>(query:T) {
      var queryObject = <any> query;
      if(queryObject.constructor.name) entryQuery = queryObject.constructor.name;
    }
}

export function required(name: [string]) {
    return metadata.required(name);
}
export function description(text: string) {
    return metadata.description(text);
}

export function nullable(nullable: boolean) {
    return metadata.nullable(nullable);
}
export function returnType<T>(objectType: T) {
    var temp = <any>objectType;
    return metadata.returnType(temp.name);
}
export function inputListType<T>(objectType: T) {
    var temp = <any>objectType;
    return metadata.inputListType(temp.name);
}

export function mutation(target: any, key: string) {
    haveMutation = true;
    mutationProcess(target, key, models, mutations, inputs)
}

export function input(target: any, key: string) {
    inputProcess(target, key, models, inputs);
}
