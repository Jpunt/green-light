import { expect } from 'chai';
import { spawn } from 'child_process';

let GL;
let fakeServer;

function kill() {
  if (fakeServer) {
    fakeServer.stdin.pause();
    fakeServer.kill('SIGINT');
  }
}

describe('Browser', () => {
  beforeEach((done) => {
    // Stop earlier processes
    kill();

    // Start new process
    delete require.cache[require.resolve('../src')];
    GL = require('../src');
    fakeServer = spawn('./test/utils/fake-server.js');
    fakeServer.stdout.on('data', data => {
      if (data.toString().indexOf('listening') > -1) {
        done();
      }
    });
  });

  afterEach(() => {
    kill();
  });

  it('initializes Browser (without jQuery)', (done) => {
    expect(GL.browser).not.to.exist;

    GL
      .runBrowser({
        url: 'http://localhost:4000',
      })
      .then(() => {
        expect(GL.browser).to.exist;
      })
      .then(() => {
        return GL.browser
          .go('/')
          .then((window) => {
            expect(window).to.exist;
            expect(window.$).not.to.exist;
            expect(window.document.querySelector('h1').innerHTML).to.equal('Hello World!');
          });
      })
      .then(done, done);
  });

  it('initializes Browser (with jQuery)', (done) => {
    expect(GL.browser).not.to.exist;

    GL
      .runBrowser({
        url: 'http://localhost:4000',
        jQuery: true,
      })
      .then(() => {
        expect(GL.browser).to.exist;
      })
      .then(() => {
        return GL.browser
          .go('/')
          .then((window) => {
            expect(window.$).to.exist;
            expect(window.$('h1').html()).to.equal('Hello World!');
          });
      })
      .then(done, done);
  });

  it('initializes Browser and waits for response', (done) => {
    GL
      .runBrowser({
        url: 'http://localhost:4000',
        setupWindow: (window, callback) => {
          window.extraStuff = 42;
          setTimeout(callback, 200);
        },
      })
      .then(() => {
        return GL.browser
          .go('/timeout')
          .then((window) => {
            expect(window).to.exist;
            expect(window.extraStuff).to.equal(42);
            expect(window.document.querySelector('h1').innerHTML).to.equal('Hello World with timeout!');
          });
      })
      .then(done, done);
  });
});
