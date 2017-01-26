import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLList
} from 'graphql';
import "reflect-metadata";
var models = [];

export function getGraphQLType(type:string){
    if(type == "String"){
      return GraphQLString
    }
    if(type == "Number"){
      return GraphQLFloat
    }
  }
  export function field(target : any, key : string) {

      if(!models[target.constructor.name]){
       models[target.constructor.name] =  new GraphQLObjectType({
          name:target.constructor.name,
          fields:{}
          })
      }

      var t = Reflect.getMetadata("design:type", target, key);
      if(t.name== "Function"){
        var params = Reflect.getMetadata("design:paramtypes", target, key);
        var returntype = Reflect.getMetadata("design:returntype", target, key);

        if(Array.isArray(returntype())){
          models[target.constructor.name]._typeConfig.fields[key] = {
            type: new GraphQLList(models[key.slice(0, -1)]),
            resolve:  target[key]
          }
        }else{

        }
      }else{
        models[target.constructor.name]._typeConfig.fields[key] = {
          type: getGraphQLType(t.name)
        }
      }
  }

  export function query(query:string){
    var schema = new GraphQLSchema({
      query: models['root']
    });
    
    return graphql(schema, query).then(result => {

      // Prints
      // {
      //   errors: [
      //     { message: 'Cannot query field boyhowdy on RootQueryType',
      //       locations: [ { line: 1, column: 3 } ] }
      //   ]
      // }
      return result.data;

    });
  }
