import { expect } from 'chai';
import { schema } from './model';

import {
  graphql
} from 'graphql';
// if you used the '@types/mocha' method to install mocha type definitions, uncomment the following line
// import 'mocha';

describe('Mutation', () => {
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

});
