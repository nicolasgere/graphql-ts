import  {field,query} from  './../graphql-ts/index'
import {voiture} from './voiture'

//something i dont like
var t = new voiture();

export class root {
  @field
  voitures():Array<voiture>{
    var voiture1 = new voiture();
    voiture1.model = "clio";
    voiture1.annee = 1232;

    var list:Array<voiture> = [];
    list.push(voiture1);
    return list
  };
}
