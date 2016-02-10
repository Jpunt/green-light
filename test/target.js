import { expect } from 'chai';

let GL;

function kill() {
  GL = require('../src');
  const target = GL.target;
  if (target) {
    target.stop();
  }
}

describe('Target', () => {
  beforeEach(() => {
    // Stop earlier processes
    kill();

    // Start new process
    delete require.cache[require.resolve('./target')];
    delete require.cache[require.resolve('../src')];
    GL = require('../src');
  });

  afterEach(() => {
    kill();
  });

  it('initializes Target', (done) => {
    expect(GL.target).not.to.exist;

    GL
      .runTarget({
        command: `${__dirname}/utils/fake-server.js`,
        checkUrl: 'http://localhost:4000',
        checkInterval: 100,
      })
      .then(() => {
        expect(GL.Target).to.exist;
        expect(GL.target).to.exist;
      })
      .then(done, done);
  });
});
