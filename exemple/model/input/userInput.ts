import {input, inputListType, nullable} from './../../../index';


export class userInput{
  @input
  firstName:string

  @input @nullable(false)
  lastName:string

  @input
  age:number
}
