import  {field,query} from  './graphql-ts/index'
import {root} from './model/root'

var test = new root()

query( `
{
  voitures{
    model
    blabla(name:"ok")
    test{
      name
    }
    hello

  }
}
`).then(function(x){
  console.log(JSON.stringify(x));
}).catch(function(x){
  console.log('ERR',x);
})
