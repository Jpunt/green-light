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

  it('initializes Target from a file', (done) => {
    expect(GL.target).not.to.exist;

    GL
      .runTarget({
        command: `${__dirname}/utils/fake-server`,
        checkUrl: 'http://localhost:4000',
        checkInterval: 100,
      })
      .then(() => {
        expect(GL.Target).to.exist;
        expect(GL.target).to.exist;
      })
      .then(done, done);
  });

  it('initializes Target with a command with a path in the argument', (done) => {
    expect(GL.target).not.to.exist;

    GL
      .runTarget({
        command: `node ${__dirname}/utils/fake-server.js`,
        checkUrl: 'http://localhost:4000',
        checkInterval: 100,
      })
      .then(() => {
        expect(GL.Target).to.exist;
        expect(GL.target).to.exist;
      })
      .then(done, done);
  });

  it('initializes Target with a command with the current working directory set', (done) => {
    expect(GL.target).not.to.exist;

    GL
      .runTarget({
        command: 'node fake-server.js',
        cwd: `${__dirname}/utils/`,
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
