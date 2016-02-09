import jsdom from 'jsdom';

import path from 'path';
import fs from 'fs';

export default class Browser {
  constructor(config) {
    this.config = config;
  }

  start() {
    return new Promise((resolve, reject) => {
      if (this.config.verbose) {
        console.log('Setting up browser');
      }

      // Setup jQuery
      if (this.config.jQuery) {
        // TODO: Use readFile-not-sync
        // TODO: Use jquery from package
        const jQueryPath = path.resolve(__dirname, './jquery/jquery.js');
        this.jQuery = fs.readFileSync(jQueryPath).toString();
      }

      // Setup console
      if (this.config.verbose) {
        this.virtualConsole = jsdom.createVirtualConsole();
        this.virtualConsole.sendTo(console);
      }

      resolve();
    });
  }

  go(path) {
    return new Promise((resolve, reject) => {
      const url = this.config.url + path;

      if (this.config.verbose) {
        console.log('Going to url:', url);
      }

      this._getDOM(url)
        .then(window => this._setupWindow(window))
        .then(window => resolve(window))
        .catch(err => {
          console.error('Something went wrong');
          console.error('url:', url);
          console.error('error:', err);
        });
    });
  }

  _getDOM(url) {
    return new Promise((resolve, reject) => {
      jsdom.env({
        url: url,
        src: [this.jQuery],
        features: {
          FetchExternalResources: ['script'],
          ProcessExternalResources: ['script'],
        },
        virtualConsole: this.virtualConsole,
        done: (err, window) => {
          if (err) {
            return reject(err);
          }
          if (!window) {
            return reject('no window');
          }
          resolve(window);
        },
      });
    });
  }

  _setupWindow(window) {
    return new Promise((resolve, reject) => {
      window.$.findByTestRef = testRef => {
        const $el = window.$(`[data-test-ref=${testRef}]`);
        return $el.length > 0 ? $el.first() : null;
      };

      window.$.findAllByTestRef = testRef => {
        return window.$(`[data-test-ref=${testRef}]`);
      };

      // TODO: loopje ipv settimeout
      setTimeout(() => resolve(window), 200);
    });
  }

}
