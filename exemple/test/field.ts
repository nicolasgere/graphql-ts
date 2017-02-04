import { expect } from 'chai';
import { schema } from './../model/root';

import {
  graphql
} from 'graphql';
// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';

describe('Field', () => {
  it('should project list of users', (done) => {
    graphql(schema(), `
      {
        allUsers{
          firstName,
          lastName,
        }
      }
    `).then((res: any) => {
        expect(res.data.allUsers.length).to.equal(3);
        done();
      }).catch((err) => {
        done(err);
      })

  });
  it('should resolve static function', (done) => {
    graphql(schema(), `
      {
        allUsers{
          fullName
        }
      }
    `).then((res: any) => {
        expect(res.data.allUsers[0].fullName).to.equal('harry potter');
        done();
      }).catch((err) => {
        done(err);
      })
  });
  it('should resolve static function with simple argument', (done) => {
    graphql(schema(), `
      {
        allUsers(firstName:"hermione"){
          firstName
        }
      }
    `).then((res: any) => {
        expect(res.data.allUsers[0].firstName).to.equal('hermione');
        expect(res.data.allUsers.length).to.equal(1);
        done();
      }).catch((err) => {
        done(err);
      })
  });
  it('should resolve static function with simple require argument', (done) => {
    graphql(schema(), `
      {
        user(firstName:"hermione"){
          firstName
        }
      }
    `).then((res: any) => {
        expect(res.data.user.firstName).to.equal('hermione');
        done();
      }).catch((err) => {
        done(err);
      })
  });
   it('should have an error cause argument is missing', (done) => {
    graphql(schema(), `
      {
        user{
          firstName
        }
      }
    `).then((res: any) => {
        expect(res.errors).to.not.be.empty;
        done();
      }).catch((err) => {
        done(err);
      })
  });
  it('should have one friend and harry', (done) => {
   graphql(schema(), `
     {
       user(firstName:"hermione"){
         firstName
         friends{
           firstName
         }
       }
     }
   `).then((res: any) => {
       expect(res.data.user.friends[0].firstName).to.equal('harry');
       expect(res.data.user.friends.length).to.equal(1);

       done();
     }).catch((err) => {
       done(err);
     })
 });
 it('should have no friend', (done) => {
  graphql(schema(), `
    {
      user(firstName:"drago"){
        firstName
        friends{
          firstName
        }
      }
    }
  `).then((res: any) => {
      expect(res.data.user.firstName).to.equal('drago');
      expect(res.data.user.friends.length).to.equal(0);
      done();
    }).catch((err) => {
      done(err);
    })
});
});
