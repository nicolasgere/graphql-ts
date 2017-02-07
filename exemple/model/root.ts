import {field, graphqlTs, list, required, returnType, description, objectType} from './../../index';
import {dataUsers} from './data'
import {user} from './user'

@objectType @description('voila enfin le root')
export class root {
    @list @returnType(user)
    allUsers(firstName:string):user[]{
        return dataUsers().filter((x)=>{return !firstName || firstName == x.firstName}) as any[]
    }

    @field @returnType(user) @required(['firstName'])
    user(firstName:string):user{
        return dataUsers().filter((x)=>{return !firstName || firstName == x.firstName})[0] as any
    }
}


