import  {field,query, input, inputListType} from  './../graphql-ts/index'

export class distributeur {
  @field
  name: string;

  @field
  ville:string;

  constructor(name:string, ville:string){
    this.name = name;
    this.ville = ville;
  }
}

export class test{
  @input
  name: string;
 
}

export class distributeurInput{
  @input
  name: string;

  @input @inputListType('test')
  test:[test];
}


