import MockedApi from 'mocked-api';
import terminate from 'terminate';
import Chai from 'chai';

import Target from './target';
import Browser from './browser';
import MochaRunner from './tests';

export default class GreenLight {
  constructor() {
    this.api = null;
    this.API = MockedApi;

    this.target = null;
    this.Target = Target;

    this.mochaRunner = null;
    this.MochaRunner = MochaRunner;

    this.browser = null;
    this.Browser = Browser;

    this.expect = Chai.expect;
  }

  init(config) {
    return new Promise((resolve, reject) => {
      if (config.verbose) {
        console.log('Initializing GreenLight...');
      }
      resolve();
    });
  }

  start() {
    this.mochaRunner.start()
      .then(this.cleanup)
      .then(code => process.exit(code))
      .catch(err => this.fail(err));
  }

  cleanup(code) {
    return new Promise((resolve, reject) => {
      terminate(process.pid, (err) => {
        err ? reject(err) : resolve(code);
      });
    });
  }

  fail(err) {
    console.error(err);
    this.cleanup()
      .then(() => process.exit(1))
      .catch(() => process.exit(1));
  }

  /*
   * API
   */
  initAPI(config) {
    return new Promise((resolve, reject) => {
      if (config.verbose) {
        console.log('Initializing API...');
      }

      const api = this.API.setup(config);
      api.start(err => {
        if (!config.name) {
          this.api = api;
        }
        err ? reject(err) : resolve();
      });
    });
  }

  /*
   * Target
   */
  initTarget(config) {
    return new Promise((resolve, reject) => {
      if (config.verbose) {
        console.log('Initializing target...');
      }

      this.target = new Target(config);
      this.target.start().then(resolve, reject);
    });
  }

  /*
   * Browser
   */
  initBrowser(config) {
    return new Promise((resolve, reject) => {
      if (config.verbose) {
        console.log('Initializing browser...');
      }

      this.browser = new Browser(config);
      this.browser.start().then(resolve, reject);
    });
  }

  /*
   * Mocha
   */
  initMocha(config) {
    return new Promise((resolve, reject) => {
      if (config.verbose) {
        console.log('Initializing Mocha...');
      }

      this.mochaRunner = new MochaRunner(config);
      resolve();
    });
  }
}

module.exports = new GreenLight();
