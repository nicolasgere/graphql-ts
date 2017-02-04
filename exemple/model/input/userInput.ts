import {field, graphqlTs, list, required, returnType, mutation, input, inputListType} from './../../../index';


export class userInput{
  @input
  firstName:string

  @input
  lastName:string

  @input
  age:number
}
