import { expect } from 'chai';
import mockRequire from 'mock-require';

let GL;

mockRequire('mocha', class FakeMocha {
  constructor(config) {
    this.config = config;
    this.files = [];
    this.hasRun = false;
  }
  addFile(file) {
    this.files.push(file);
  }
  run(cb) {
    this.hasRun = true;
    cb();
  }
});

describe('Tests', () => {
  beforeEach(() => {
    delete require.cache[require.resolve('./tests')];
    delete require.cache[require.resolve('../src')];
    GL = require('../src');
  });

  after(() => {
    mockRequire.stop('mocha');
  });

  it('initializes with config', (done) => {
    GL.runTests({
      glob: 'test/utils/**/*',
      mocha: { reporter: 'nyan' },
    })
      .then(() => {
        expect(GL.tests.config.glob).to.equal('test/utils/**/*');
        expect(GL.tests.mocha.config.reporter).to.equal('nyan');
        expect(GL.tests.mocha.hasRun).to.equal(true);
        expect(GL.tests.mocha.files).to.include('test/utils/fake-server.js');
      })
      .then(done, done);
  });
});
