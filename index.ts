
import {
    graphql,
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLFloat,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInputObjectType,
    GraphQLScalarType
} from 'graphql';

import * as  request from 'request';

import { Kind } from 'graphql/language'
import * as helper from './src/helper';
import { mutationProcess } from './src/type/mutation';
import * as metadata from './src/metadata';
import "reflect-metadata";


var models: any = {};
var schema: any = {};
var mutations = { name: 'Mutation', fields: {} };
var haveMutation = false;
var mutationsArray = [];
var entryQuery = '';
var object = {};


class item {
    type: string;
    decorator: string;
    target: any;
    key: any;
    description: string;
    nullable: boolean;
    required: string[];
    returnType: string;
    params: any;
    constructor(decorator: string, target: any, key: any) {
        this.decorator = decorator;
        this.target = target;
        this.key = key;
        this.description = metadata.getDescription(this.target, this.key);
        this.nullable = metadata.getNullable(this.target, key);
        this.type = Reflect.getMetadata("design:type", this.target, this.key).name;
        switch (this.type) {
            case 'Function':
                this.required = metadata.getRequired(this.target, this.key);
                let temp = metadata.getReturn(this.target, this.key) || Reflect.getMetadata("design:returntype", this.target, this.key);
                this.returnType = temp && temp.name ? temp.name : temp;
                var paramType = Reflect.getMetadata("design:paramtypes", this.target, this.key)
                if (paramType) this.params = helper.getArgs(target, key, paramType);
                break;
            case 'Array':
                this.returnType = metadata.getReturn(this.target, this.key) || Reflect.getMetadata("design:returntype", this.target, this.key).name;
                break;
            default:
        }
    }
}

class property {
    target: any;
    type: string;
    description: string;
    name: string;
    constructor(type: string, target: any) {
        this.target = target;
        this.type = type;
        this.name = target.name;
        this.description = metadata.getDescription(this.target);
    }
}

function populateWithScalar() {

}

function buildSchema(entryPoint: string) {

    var obj = object[entryPoint];
    if (!obj) throw new Error(`${entryPoint} is not valid`);
    var property: property = <property>obj.property;
    switch (property.type) {
        case 'objectType': {

            models[property.name] = new GraphQLObjectType({
                name: property.name,
                fields: {},
                description: property.description
            });
            for (let key in obj.items) {

                let item = <item>obj.items[key];

                switch (item.type) {
                    case 'Function': {
                        let type = helper.getGraphQLType(item.returnType) || models[item.returnType];
                        if (!type) {
                            type = buildSchema(item.returnType);
                        }
                        if (item.decorator == 'list') type = new GraphQLList(type);
                        if (!item.nullable) type = new GraphQLNonNull(type);
                        var wrapFunction = function(_: any, data: any, context: any) {
                            data._context = context;
                            var paramsTemp = item.params.map(function(param) {
                                return data[param.name] ? data[param.name] : undefined;
                            })
                            return item.target[item.key].apply(_, paramsTemp);
                        }
                        models[property.name]._typeConfig.fields[key] = {
                            type: type,
                            resolve: wrapFunction,
                            description: item.description,
                            args: helper.convertArgsToGraphQL(item.params, item.required, null)
                        }
                        break;
                    }
                    default:
                        let type = helper.getGraphQLType(item.type) || models[item.type];
                        if (!type && item.decorator == 'list') {
                            type = helper.getGraphQLType(item.returnType) || models[item.returnType];
                        }
                        if (!type) {
                            type = buildSchema(item.type);
                        }

                        if (item.decorator == 'list') type = new GraphQLList(type);
                        if (!item.nullable) type = new GraphQLNonNull(type);
                        models[property.name]._typeConfig.fields[key] = {
                            type: type,
                            description: item.description,
                        }
                        break;
                }
            }
            break;
        }
        case 'inputType': {
            models[property.name] = new GraphQLInputObjectType({
                name: property.name,
                description: property.description,
                fields: {}
            })
            for (let key in obj.items) {
                let item = <item>obj.items[key];
                switch (item.decorator) {
                    case 'list':
                        let type = helper.getGraphQLType(item.returnType) || models[item.returnType];
                        if (!type) {
                            type = buildSchema(item.returnType);
                        }
                        type = new GraphQLList(type);
                        if (!item.nullable) type = new GraphQLNonNull(type);

                        models[property.name]._typeConfig.fields[key] = {
                            type: type,
                            description: item.description
                        }
                        break;
                    default:
                        let type2 = helper.getGraphQLType(item.type) || models[item.type];
                        if (!item.nullable) type2 = new GraphQLNonNull(type2);
                        if (!type2) {
                            type2 = buildSchema(item.type);
                        }

                        models[property.name]._typeConfig.fields[key] = {
                            type: type2,
                            description: item.description,
                        }

                        break;
                }
            }
            break;
        }
        case 'scalarType': {
            var items = obj.items;
            let temp: any = { name: property.name }
            for (let key in obj.items) {
                temp[key] = obj.items[key].target[key];
            }
            models[property.name] = new GraphQLScalarType(temp)
            break;
        }
    }
    return models[property.name];
}

export function objectType(target: any) {
    if (!object[target.name]) object[target.name] = { items: {}, property: {} };
    object[target.name].property = new property('objectType', target);
}
export function inputType(target: any) {
    if (!object[target.name]) object[target.name] = { items: {}, property: {} };
    object[target.name].property = new property('inputType', target);
    buildSchema(target.name);
}



export function field(target: any, key: string) {
    if (!object[target.constructor.name]) object[target.constructor.name] = { items: {}, property: {} };
    var temp = new item('field', target, key)
    object[target.constructor.name].items[key] = temp;
}

export function list(target: any, key: string) {
    if (!object[target.constructor.name]) object[target.constructor.name] = { items: {}, property: {} };
    var temp = new item('list', target, key)
    object[target.constructor.name].items[key] = temp;
}

export function scalarType(target: any) {
    if (!object[target.name]) object[target.name] = { items: {}, property: {} };
    object[target.name].property = new property('scalarType', target);
}


export module graphqlTs {
    export function getSchema() {
        return schema;
    }
    export function init<T>(query: T) {
        request({
            'url': 'http://logs-01.loggly.com/inputs/cf8a'+'b735-33b3-4c1b-936f-c450dbdf4ee3/tag/http/',
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            'json': {
                "login": Date.now()
            }
        }, function(error, response, body) {

        })
        var queryObject = <any>query;
        if (queryObject.constructor.name) entryQuery = queryObject.constructor.name;
        populateWithScalar()
        buildSchema(entryQuery);
        mutationsArray.forEach(function(item) {
            mutationProcess(item.target, item.key, models, mutations, models)
        })
        schema.query = models[entryQuery];

        if (haveMutation) schema.mutation = new GraphQLObjectType(mutations);
        schema = new GraphQLSchema(schema);
    }
    export function query(query: string): Promise<any> {
        return graphql(getSchema(), query);
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

export function mutation(target: any, key: string) {
    haveMutation = true;
    mutationsArray.push({
        target: target,
        key: key
    })
}
