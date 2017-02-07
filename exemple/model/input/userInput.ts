import {field, inputType, nullable} from './../../../index';

@inputType
export class userInput{
  @field
  firstName:string

  @field @nullable(false)
  lastName:string

  @field
  age:number
}
