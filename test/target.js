import { expect } from 'chai';

let GL;

describe('Target', () => {
  beforeEach(() => {
    // Stop earlier processes
    GL = require('../src');
    const target = GL.target;
    if (target) {
      target.stop();
    }

    // Start new process
    delete require.cache[require.resolve('./target')];
    delete require.cache[require.resolve('../src')];
    GL = require('../src');
  });

  it('initializes Target', (done) => {
    expect(GL.target).not.to.exist;

    GL
      .initTarget({
        cmd: `${__dirname}/utils/fake-server.js`,
        url: 'http://localhost:6666',
        interval: 200,
      })
      .then(() => {
        expect(GL.Target).to.exist;
        expect(GL.target).to.exist;
      })
      .then(done, done);
  });
});
