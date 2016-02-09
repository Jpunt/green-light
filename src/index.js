import MockedApi from 'mocked-api';
import terminate from 'terminate';
import Chai from 'chai';

import { parseConfigFor } from './config-helper';
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
    config = parseConfigFor('api', config);

    return new Promise((resolve, reject) => {
      if (config.verbose) {
        console.log('Initializing API...');
      }

      const api = this.API.setup(config);

      if (!config.name) {
        // handy shortcut:
        this.api = api;
      } else {
        // should be referenced with GreenLight.API.getByName()
      }

      api.start(err => {
        if (err) {
          throw err;
        }

        if (config.verbose) {
          console.log('API ready');
        }

        resolve();
      });
    });
  }

  /*
   * Target
   */
  runTarget(config) {
    config = parseConfigFor('target', config);

    if (config.verbose) {
      console.log('Initializing target...');
    }

    this.target = new Target(config);
    return this.target.start().then(() => {
      if (config.verbose) {
        console.log('Target ready');
      }
      Promise.resolve();
    });
  }

  /*
   * Browser
   */
  runBrowser(config) {
    config = parseConfigFor('browser', config);

    if (config.verbose) {
      console.log('Initializing browser...');
    }

    this.browser = new Browser(config);
    return this.browser.start().then(() => {
      if (config.verbose) {
        console.log('Browser ready');
      }
      Promise.resolve();
    });
  }

  /*
   * Mocha
   */
  runTests(config) {
    config = parseConfigFor('tests', config);

    if (config.verbose) {
      console.log('Initializing tests...');
    }

    this.tests = new Tests(config);
    return this.tests.start().then(() => {
      if (config.verbose) {
        console.log('Tests ready');
      }
      Promise.resolve();
    });
  }
}

module.exports = new GreenLight();
