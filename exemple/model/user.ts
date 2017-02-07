import { DateQl } from './scalar/date';
import {field, graphqlTs, list, required, returnType, mutation, objectType,description, nullable} from './../../index';
import {friends,dataUsers } from './data'
import {userInput} from './input/userInput';
import {friendListInput} from './input/friendListInput';


@objectType @description('description for user')
export class user{
    @field @nullable(false)
    firstName:string

    @field
    lastName:string
 
    @field
    age:number

    @field
    birthday?: DateQl

    @list @returnType(Number)
    notes:number[]

    @field @description('fullname + firstName')
    fullName():string{
        return this.firstName + ' ' + this.lastName
    }

    @list @returnType(user)
    friends():user[]{
        return dataUsers().filter((x)=>{return friends()[this.firstName].indexOf(x.firstName) != -1 }) as any
    }

    @mutation
    addUser(userInput:userInput):user{
      let newUser = new user();
      newUser.firstName = userInput.firstName;
      newUser.lastName = userInput.lastName;
      newUser.age = userInput.age;
      
      dataUsers().push(<any>newUser);
      return  newUser;
    }

    @mutation @description('one mutation')
    createLinq(friends:friendListInput):String{
      return friends.names.join(',');
    }

}
