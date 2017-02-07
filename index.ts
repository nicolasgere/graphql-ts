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
var models2:any = {};
var mutations = { name: 'Mutation', fields:  {} };
var haveMutation = false;
var inputs = {};

var entryQuery = '';
var entryMutation = '';


var fields = {};


class item {
  type:string;
  decorator:string;
  target:any;
  key:any;
  description:string;
  nullable:boolean;
  required:string[];
  returnType:string;
  params:any;
  constructor(decorator:string,target:any, key:any){
    this.decorator = decorator;
    this.target = target;
    this.key = key;
    this.description = metadata.getDescription(this.target,this.key);
    this.nullable = metadata.getNullable(this.target,key);
    this.type = Reflect.getMetadata("design:type", this.target, this.key).name;
    switch (this.type)
    {
      case'Function':
      this.required = metadata.getRequired(this.target,this.key);
      this.returnType = metadata.getReturn(this.target,this.key) || Reflect.getMetadata("design:returntype", this.target, this.key).name;
      this.params = helper.getArgs(target,key, Reflect.getMetadata("design:paramtypes", this.target, this.key));
      break;
      default:

    }
  }
}

class property{
  target:any;
  type:string;
  description:string;
  name:string;
  constructor(type:string,target:any) {
    this.target = target;
    this.type = type;
    this.name = target.name;
    this.description = metadata.getDescription(this.target);
  }
}

function buildSchema(entryPoint:string){

  var obj = fields[entryPoint];
  if(!obj) throw new Error(`${entryPoint} is not valid`);
  var property:property = <property> obj.property;
  switch(property.type){
    case 'objectType':
    console.log('ON BUILD '+ property.name);
    models2[property.name] = new GraphQLObjectType({
      name: property.name,
      fields: {},
      description: property.description
    });
    for (let key in obj.items) {
      let item = <item>obj.items[key];
      switch(item.type){
        case 'Function':
        let type = helper.getGraphQLType(item.returnType) || models2[item.returnType];
        if(!type){
          type = buildSchema(item.returnType);
        }
        if(item.decorator == 'list') type = new GraphQLList(type);
        if(!item.nullable) type = new GraphQLNonNull(type);

        var wrapFunction = function(_:any, data:any) {
          var paramsTemp = item.params.map(function(param){
            return data[param.name] ? data[param.name] : undefined;
          })
          return item.target[item.key].apply(_,paramsTemp);
        }
        models2[property.name]._typeConfig.fields[key] = {
          type: type,
          resolve: wrapFunction,
          description:item.description,
          args: helper.convertArgsToGraphQL(item.params, item.required, null)
        }
        break;
        default:
        let type2 = helper.getGraphQLType(item.type) || models2[item.type];
        if(!item.nullable) type2 = new GraphQLNonNull(type2);

        if(!type2){
          type2 = buildSchema(item.type);
        }
        models2[property.name]._typeConfig.fields[key] = {
          type: type2,
          description:item.description,
        }
        break;
      }
    }
    break;
  }
  return models2[property.name];
}

export function objectType(target: any) {
  objectTypeProcess(target,models);
  if(!fields[target.name]) fields[target.name] = {items:{}, property:{}};
  fields[target.name].property= new property('objectType',target);
}



export function field(target: any, key: string) {
  fieldProcess(target, key, models)
  if(!fields[target.constructor.name]) fields[target.constructor.name] = {items:{}, property:{}};

  var temp = new item('field',target,key)
  fields[target.constructor.name].items[key] = temp;
}

export function list(target: any, key: string) {
  listProcess(target, key, models)
  if(!fields[target.constructor.name]) fields[target.constructor.name] = {items:{}, property:{}};

  var temp = new item('list',target,key)
  fields[target.constructor.name].items[key] = temp;
}


export module graphqlTs {
  export function getSchema() {
    var schema: any = {};
    if(!entryQuery) {
      throw new Error('You have to init the root query object')
    }
    console.log(JSON.stringify(models2.root, null, 2));

    schema.query = models2[entryQuery];

    //if (haveMutation) schema.mutation = new GraphQLObjectType(mutations);
    return new GraphQLSchema(schema);
  }
  export function init<T>(query:T) {

    var queryObject = <any> query;
    if(queryObject.constructor.name) entryQuery = queryObject.constructor.name;
    buildSchema(entryQuery);
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
