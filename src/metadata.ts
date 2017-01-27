
const requiredMetadataKey = Symbol("required");
const returnMetadataKey = Symbol("return");
const inputMetadataKey = Symbol("input");
const descriptionMetadataKey = Symbol("desc");

export function required(name:[string]){
  return Reflect.metadata(requiredMetadataKey, JSON.stringify(name));
}
export function returnType(name:string){
  return Reflect.metadata(returnMetadataKey, JSON.stringify(name));
}
export function description(text:string){
  return Reflect.metadata(descriptionMetadataKey, text);
}
export function inputListType(name:string){
  return Reflect.metadata(inputMetadataKey, JSON.stringify(name));
}

export function getInput(target,key){
  var temp =  Reflect.getMetadata(inputMetadataKey, target, key);
  if(!temp) return '';
  return temp.replace('"','').replace('"','')
}
export function getDescription(target,key){
  var temp =  Reflect.getMetadata(descriptionMetadataKey, target, key);
  if(!temp) return '';
  return temp.replace('"','').replace('"','')
}
export function getReturn(target,key){
  var temp =  Reflect.getMetadata(returnMetadataKey, target, key);
  if(!temp) return '';
  return temp.replace('"','').replace('"','')
}

export function getRequired(target,key){
  const temp =  Reflect.getMetadata(requiredMetadataKey, target, key);
  if(temp){
    return JSON.parse(temp);
  }else{
    return [];
  }
}