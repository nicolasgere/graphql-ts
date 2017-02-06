import {field, graphqlTs, list, required, returnType, description, objectType} from './../../index';
import {dataUsers} from './data'
import {user} from './user'

@objectType @description('voila enfin le root')
class root {
    @list @returnType(user)
    allUsers(firstName:string):user[]{
        return dataUsers().filter((x:user)=>{return !firstName || firstName == x.firstName}) as user[]
    }

    @field @returnType(user) @required(['firstName'])
    user(firstName:string):user{
        return dataUsers().filter((x:user)=>{return !firstName || firstName == x.firstName})[0] as user
    }
}

graphqlTs.init(new root());

export function schema(){
    return  graphqlTs.getSchema();
}
