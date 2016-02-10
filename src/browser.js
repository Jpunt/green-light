import jsdom from 'jsdom';

import path from 'path';
import fs from 'fs';

export default class Browser {
  constructor(config) {
    this.config = {
      verbose: config.verbose,
      url: config.url,
      jQuery: config.jQuery,
      setupWindow: config.setupWindow || (w => Promise.resolve(w)),
    };

    if (!this.config.url) {
      throw new Error('No url set for Browser');
    }
  }

  start() {
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

    return Promise.resolve();
  }

  go(path) {
    const url = this.config.url + path;

    if (this.config.verbose) {
      console.log('Going to url:', url);
    }

    return this._getDOM(url)
      .then(window => this.config.setupWindow(window))
      .catch(err => {
        console.error('Something went wrong');
        console.error('url:', url);
        console.error('error:', err);
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
}
