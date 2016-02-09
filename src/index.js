import MockedApi from 'mocked-api';
import terminate from 'terminate';
import Chai from 'chai';

import Target from './target';
import Browser from './browser';
import Tests from './tests';

export default class GreenLight {
  constructor() {
    this.api = null;
    this.API = MockedApi;

    this.target = null;
    this.Target = Target;

    this.browser = null;
    this.Browser = Browser;

    this.tests = null;
    this.Tests = Tests;

    this.expect = Chai.expect;
  }

  init() {
    return Promise.resolve();
  }

  done(exitCode) {
    return this.clean().then(() => {
      process.exit(exitCode);
    });
  }

  fail(err) {
    return this.clean().then(() => {
      console.error(err.stack || err);
      process.exit(1);
    });
  }

  clean() {
    return new Promise((resolve, reject) => {
      terminate(process.pid, (err) => {
        if (err) {
          throw err;
        }
        resolve();
      });
    });
  }

  /*
   * API
   */
  runAPI(config) {
    return new Promise((resolve, reject) => {
      if (config.verbose) {
        console.log('Initializing API...');
      }

      const api = this.API.setup(config);

      api.start(err => {
        if (err) {
          throw err;
        }

        if (!config.name) {
          this.api = api;
        }

        resolve();
      });
    });
  }

  /*
   * Target
   */
  runTarget(config) {
    if (config.verbose) {
      console.log('Initializing target...');
    }

    this.target = new Target(config);
    return this.target.start();
  }

  /*
   * Browser
   */
  runBrowser(config) {
    if (config.verbose) {
      console.log('Initializing browser...');
    }

    this.browser = new Browser(config);
    return this.browser.start();
  }

  /*
   * Mocha
   */
  runTests(config) {
    if (config.verbose) {
      console.log('Initializing Mocha...');
    }

    this.tests = new Tests(config);
    return this.tests.start();
  }
}

module.exports = new GreenLight();
