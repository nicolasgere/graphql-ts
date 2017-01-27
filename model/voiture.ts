import  {field,required, returnType, mutation} from  './../graphql-ts/index'
import {distributeur, distributeurInput} from './distributeur'


var db = "yahou";

export class voiture {
    @field
    model: string;

    @field
    annee:number;

    @field @required(['name']) @returnType('string')
    distributeurs():Array<string>{
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
    @mutation @returnType('string')
    add_distributeur(test:distributeurInput):[string]{
      return ['test'];
    }
}
