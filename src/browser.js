import jsdom from 'jsdom';
import path from 'path';
import fs from 'fs';
import poll from 'promise-poller';

export default class Browser {
  constructor(config) {
    this.config = {
      verbose: config.verbose,
      baseUrl: config.baseUrl,
      jQuery: config.jQuery,
      setupWindow: config.setupWindow || (w => w),
      readyWhen: config.readyWhen || (w => true),
      readyWhenInterval: config.readyWhenInterval || 10,
      readyWhenTimeout: config.readyWhenTimeout || 2000,
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
    this.virtualConsole = jsdom.createVirtualConsole();
    this.virtualConsole.on('error', (...errors) => console.log('\x1b[31m', ...errors, '\x1b[0m'));
    if (this.config.verbose) {
      // Errors are logged weither or not verbose is enabled,
      // so we don't have to pass those here again.
      this.virtualConsole.sendTo(Object.assign(console, { error:null }));
    }

    return Promise.resolve();
  }

  go(path) {
    const url = this.config.baseUrl + path;
    this.url = url;

    if (this.config.verbose) {
      console.log('Going to url:', url);
    }

    return this._getDOM(url)
      .then(window => this.window = window)
      .then(() => this._waitForReady(this.window))
      .then(() => this.config.setupWindow(this.window))
      .then(() => this.window)
      .catch(err => {
        console.error(`Something went wrong at: ${url}`);
        console.trace(err);
      });
  }

  reset() {
    if (this.window) {
      this.window.close();
      delete this.window;
    }
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

  _waitForReady(window) {
    return poll({
      taskFn: () => this.config.readyWhen(window) ? Promise.resolve() : Promise.reject(),
      interval: this.config.readyWhenInterval,
      // timeout: this.config.readyWhenTimeout,
      retries: this.config.readyWhenTimeout / this.config.readyWhenInterval, // Tmp fix for: https://github.com/joeattardi/promise-poller/issues/4
    }).catch(err => Promise.reject(new Error('browser timeout')));
  }
}
