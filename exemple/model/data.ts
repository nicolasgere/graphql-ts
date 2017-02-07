var data = [
  {firstName:'harry', lastName:'potter', age:18, notes:[10,10], birthday: "10/10/1990"},
   {firstName:'hermione', lastName:'granger', age:17, notes:[19,19], birthday: "10/10/1990"},
    {firstName:'drago', lastName:'malfoy', age:17, notes:[10,10], birthday: "10/10/1990"}];

var friend = {harry:['hermione'],hermione:['harry'], drago:[]}

export function dataUsers(){
  return data;
}

export function friends(){
  return friend;
}
