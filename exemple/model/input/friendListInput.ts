import {field, graphqlTs, list, required, returnType, mutation, nullable, inputType} from './../../../index';

@inputType
export class friendListInput{
   @list @returnType(String) @nullable(false)
   names:string[]
}
