import  {field,query} from  './../decorator'
import {distributeur} from './distributeur'

var t = new distributeur();

export class voiture {
    @field
    model: string;

    @field
    annee:number;

    @field
    distributeurs():Array<distributeur>{
      return  [{name:"blabla", ville:"tarbes"}];
    }
}
