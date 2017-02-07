import { expect } from 'chai';
import { schema } from './../model/root';

import {
  graphql
} from 'graphql';
// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';

describe('Mutation', () => {
  it('create user with userInput', (done) => {
    graphql(schema(), `
        mutation Exemple {
          addUser (userInput:{firstName:"ron", lastName:"weisley", age:18}){
            firstName,
            lastName,
            age
          }
        }
    `).then((res: any) => {
        expect(res.data.addUser.firstName).to.equal('ron');
        done();
      }).catch((err) => {
        done(err);
      })
  });
  it('create user with userInput missing a nullable field', (done) => {
    graphql(schema(), `
        mutation Exemple {
          addUser (userInput:{firstName:"ron", lastName:"weisley"}){
            firstName,
            lastName,
            age
          }
        }
    `).then((res: any) => {
        expect(res.data.addUser.firstName).to.equal('ron');
        done();
      }).catch((err) => {
        done(err);
      })
  });
  it('create user with userInput for test the nonNull component', (done) => {
    graphql(schema(), `
        mutation Exemple {
          addUser (userInput:{firstName:"ron", age:18}){
            firstName,
            lastName,
            age
          }
        }
    `).then((res: any) => {
        expect(res.errors).to.not.be.undefined;
        done();
      }).catch((err) => {
        done(err);
      })
  });
  it('use input list', (done) => {
    graphql(schema(), `
        mutation Exemple {
          createLinq (friends:{names:["hermione", "ron"]})
        }
    `).then((res: any) => {
        expect(res.data.createLinq).to.equal('hermione,ron');
        done();
      }).catch((err) => {
        done(err);
      })
  });
});
