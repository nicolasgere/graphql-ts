var data = [{firstName:'harry', lastName:'potter', age:18}, {firstName:'hermione', lastName:'granger', age:17}, {firstName:'drago', lastName:'malfoy', age:17}];

var friend = {harry:['hermione'],hermione:['harry'], drago:[]}

export function dataUsers(){
  return data;
}

export function friends(){
  return friend;
}
