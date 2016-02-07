import MockedApi from 'mocked-api';
import Target from './target';

module.exports = {
  init: function(config) {
    return new Promise((resolve, reject) => {
      if (config.verbose) {
        console.log('Initializing GreenLight...');
      }
      resolve();
    });
  },

  /*
   * API
   */
  api: null,
  API: MockedApi,
  initAPI: function(config) {
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
  },

  /*
   * Target
   */
  target: null,
  Target: Target,
  initTarget: function(config) {
    return new Promise((resolve, reject) => {
      if (config.verbose) {
        console.log('Initializing target...');
      }

      this.target = new Target(config);
      this.target.start().then(resolve, reject);
    });
  },
};
