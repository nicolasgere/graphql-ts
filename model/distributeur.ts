import  {field,query} from  './../graphql-ts/index'

export class distributeur {
  @field
  name: string;

  @field
  ville:string;
}
