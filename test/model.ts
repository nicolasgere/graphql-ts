import {field, graphqlTs, list, required, returnType} from './../index';

var dataUsers = [{firstName:'harry', lastName:'potter', age:18}, {firstName:'hermione', lastName:'granger', age:17}, {firstName:'drago', lastName:'malfoy', age:17}];

var friends = {harry:['hermione'],hermione:['harry']}

class user{
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
        return dataUsers.filter((x:user)=>{return friends[this.firstName].indexOf(x.firstName) != -1 }) as user[]
    }

}

class root{
    @list @returnType(user)
    allUsers(firstName:string):user[]{
        return dataUsers.filter((x:user)=>{return !firstName || firstName == x.firstName}) as user[]
    }

    @field @returnType(user) @required(['firstName'])
    user(firstName:string):user{
        return dataUsers.filter((x:user)=>{return !firstName || firstName == x.firstName})[0] as user
    }
}
var test = new root();

export function schema(){
    return  graphqlTs.getSchema();
} 