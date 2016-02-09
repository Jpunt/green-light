import Mocha from 'mocha';
import glob from 'glob';

export default class Tests {
  constructor(config) {
    this.config = config;
    this.mocha = new Mocha(this.config.mocha);
  }

  start() {
    if (this.config.verbose) {
      console.log('Running tests...');
    }

    return new Promise((resolve, reject) => {
      glob(this.config.glob, (err, files) => {
        files.forEach(file => this.mocha.addFile(file));
        this.mocha.run((failures) => resolve(failures));
      });
    });
  }
}
