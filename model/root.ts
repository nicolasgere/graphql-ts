import  {field, description} from  './../graphql-ts/index'
import {voiture} from './voiture'


export class root {
  @field  @description('la liste des voitures')
  voitures():Array<voiture>{
    var voiture1 = new voiture();
    voiture1.model = "clio";
    voiture1.annee = 1232;

    var list:Array<voiture> = [];
    list.push(voiture1);
    return list
  };
}
