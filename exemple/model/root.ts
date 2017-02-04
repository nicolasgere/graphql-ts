import {field, graphqlTs, list, required, returnType} from './../../index';
import {dataUsers} from './data'
import {user} from './user'

class root{
    @list @returnType(user)
    allUsers(firstName:string):user[]{
        return dataUsers().filter((x:user)=>{return !firstName || firstName == x.firstName}) as user[]
    }

    @field @returnType(user) @required(['firstName'])
    user(firstName:string):user{
        return dataUsers().filter((x:user)=>{return !firstName || firstName == x.firstName})[0] as user
    }
}

export function schema(){
    return  graphqlTs.getSchema();
}
