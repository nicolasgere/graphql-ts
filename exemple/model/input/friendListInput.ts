import {field, graphqlTs, list, required, returnType, mutation, input, inputListType} from './../../../index';

export class friendListInput{
   @input @inputListType(String)
   names:string[]
}
