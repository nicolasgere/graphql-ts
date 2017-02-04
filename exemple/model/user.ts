import {field, graphqlTs, list, required, returnType, mutation, input, inputListType} from './../../index';
import {friends,dataUsers } from './data'
import {userInput} from './input/userInput';
import {friendListInput} from './input/friendListInput';

export class user{
    @field
    firstName:string

    @field
    lastName:string

    @field
    age:number

    @field
    fullName():string{
        return this.firstName + ' ' + this.lastName
    }

    @list @returnType(user)
    friends():user[]{
        return dataUsers().filter((x:user)=>{return friends()[this.firstName].indexOf(x.firstName) != -1 }) as user[]
    }

    @mutation
    addUser(userInput:userInput):user{
      let newUser = new user();
      newUser.firstName = userInput.firstName;
      newUser.lastName = userInput.lastName;
      newUser.age = userInput.age;
      dataUsers().push(newUser);
      return  newUser;
    }

    @mutation
    createLinq(friends:friendListInput):String{
      return friends.names.join(',');
    }

}
