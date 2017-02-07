import { expect } from 'chai';
import { root } from './../model/root';
import { graphqlTs } from './../../index';


// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';
graphqlTs.init(new root());
describe('Field', () => {
  it('should project list of users', (done) => {
    graphqlTs.query(`
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
    graphqlTs.query(`
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
    graphqlTs.query(`
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
    graphqlTs.query(`
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
    graphqlTs.query(`
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
   graphqlTs.query(`
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
  graphqlTs.query(`
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
it('should have note', (done) => {
  graphqlTs.query(`
    {
      user(firstName:"drago"){
        notes
        
      }
    }
  `).then((res: any) => {
      expect(res.data.user.notes.length).to.equal(2);
      done();
    }).catch((err) => {
      done(err);
    })
});
it('should be a date using the scalar', (done) => {
  graphqlTs.query(`
    {
      user(firstName:"drago"){
        birthday
      }
    }
  `).then((res: any) => {
      expect(res.data.user.birthday).to.equal('1990-10-10T04:00:00.000Z');
      done();
    }).catch((err) => {
      done(err);
    })
})
});
