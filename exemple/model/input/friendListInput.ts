import {field, graphqlTs, list, required, returnType, mutation, input, inputListType, nullable} from './../../../index';

export class friendListInput{
   @input @inputListType(String) @nullable(false)
   names:string[]
}
