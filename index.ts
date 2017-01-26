import  {field,query} from  './decorator'


import {root} from './model/root'

var test = new root()

query( `
{
  voitures{
    model
    distributeurs{
      name
    }

  }
}
`).then(function(x){
  console.log(x);
})
