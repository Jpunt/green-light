import jsdom from 'jsdom';

import path from 'path';
import fs from 'fs';

export default class Browser {
  constructor(config) {
    this.config = {
      verbose: config.verbose,
      baseUrl: config.baseUrl,
      jQuery: config.jQuery,
      setupWindow: config.setupWindow || (w => Promise.resolve(w)),
    };

    if (!this.config.baseUrl) {
      throw new Error('No baseUrl set for Browser');
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
    const url = this.config.baseUrl + path;

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
            return reject(new Error('no window'));
          }
          resolve(window);
        },
      });
    });
  }
}
