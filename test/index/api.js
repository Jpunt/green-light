import { expect } from 'chai';

let GreenLight;

describe('index', () => {
  describe('API', () => {
    beforeEach(() => {
      // Stop earlier processes
      GreenLight = require('../../src');
      const API = GreenLight.API;
      [API.api, API.getByName('a'), API.getByName('b')].forEach(api => {
        if (api) {
          api.stop();
        }
      });

      // Start new process
      delete require.cache[require.resolve('mocked-api')];
      delete require.cache[require.resolve('../../src')];
      GreenLight = require('../../src');
    });

    it('initializes single API', (done) => {
      expect(GreenLight.api).not.to.exist;

      GreenLight
        .initAPI({ port:3000, dir:'./mocks' })
        .then(() => {
          expect(GreenLight.API).to.exist;
          expect(GreenLight.api).to.exist;
        })
        .then(done, done);
    });

    it(`initializes multiple API's`, (done) => {
      expect(GreenLight.API.getByName('a')).not.to.exist;
      expect(GreenLight.API.getByName('b')).not.to.exist;

      GreenLight
        .initAPI({ name:'a', port:3000, dir:'./mocks' })
        .then(() => {
          expect(GreenLight.API).to.exist;
          expect(GreenLight.api).not.to.exist;
          expect(GreenLight.API.getByName('a')).to.exist;
          expect(GreenLight.API.getByName('b')).not.to.exist;
        });

      GreenLight
        .initAPI({ name:'b', port:3001, dir:'./mocks' })
        .then(() => {
          expect(GreenLight.API).to.exist;
          expect(GreenLight.api).not.to.exist;
          expect(GreenLight.API.getByName('a')).to.exist;
          expect(GreenLight.API.getByName('b')).to.exist;
        })
        .then(done, done);
    });
  });
});
