import { expect } from 'chai';

let GL;

describe('API', () => {
  beforeEach(() => {
    // Stop earlier processes
    GL = require('../src');
    const API = GL.API;
    [API.api, API.getByName('a'), API.getByName('b')].forEach(api => {
      if (api) {
        api.stop();
      }
    });

    // Start new process
    delete require.cache[require.resolve('mocked-api')];
    delete require.cache[require.resolve('../src')];
    GL = require('../src');
  });

  it('initializes single API', (done) => {
    expect(GL.api).not.to.exist;

    GL
      .initAPI({ port:3000, dir:'./mocks' })
      .then(() => {
        expect(GL.API).to.exist;
        expect(GL.api).to.exist;
      })
      .then(done, done);
  });

  it(`initializes multiple API's`, (done) => {
    expect(GL.API.getByName('a')).not.to.exist;
    expect(GL.API.getByName('b')).not.to.exist;

    GL
      .initAPI({ name:'a', port:3000, dir:'./mocks' })
      .then(() => {
        expect(GL.API).to.exist;
        expect(GL.api).not.to.exist;
        expect(GL.API.getByName('a')).to.exist;
        expect(GL.API.getByName('b')).not.to.exist;
      });

    GL
      .initAPI({ name:'b', port:3001, dir:'./mocks' })
      .then(() => {
        expect(GL.API).to.exist;
        expect(GL.api).not.to.exist;
        expect(GL.API.getByName('a')).to.exist;
        expect(GL.API.getByName('b')).to.exist;
      })
      .then(done, done);
  });
});
