import  {field,query, required, returnType} from  './../graphql-ts/index'
import {distributeur} from './distributeur'

var t = new distributeur();

var db = "yahou";

export class voiture {
    @field
    model: string;

    @field
    annee:number;

    @field @required(['name']) @returnType('string')
    blabla(name:string):Array<string>{
      return  ['jolw','quetal'];
    }
    @field
    test():distributeur{
      return  {name:"blabla", ville:"tarbes"};
    }
    @field
    hello():String{
      return  "hello world";
    }
}
