import fetch from 'node-fetch';
import { spawn } from 'child_process';

export default class Target {
  constructor(config) {
    this.process = null;

    this.config = {
      verbose: config.verbose,
      command: config.command,
      checkUrl: config.checkUrl,
      checkInterval: config.checkInterval || 1000,
      // TODO: checkTimeout
    };

    if (!this.config.command) {
      throw new Error('No command set to run target');
    }

    if (!this.config.checkUrl) {
      throw new Error('No url set to check target');
    }
  }

  start() {
    return this.check()
      .then(() => this.alreadyRunning())
      .catch(() => this.buildTarget());
  }

  stop() {
    if (this.process) {
      this.process.stdin.pause();
      this.process.kill('SIGINT');
    }
  }

  check() {
    if (this.config.verbose) {
      console.log(`Checking target at: ${this.config.checkUrl}`);
    }
    return fetch(this.config.checkUrl);
  }

  alreadyRunning() {
    if (this.config.verbose) {
      console.log('Target already running');
    }
    return Promise.resolve();
  }

  buildTarget() {
    return new Promise((resolve, reject) => {
      if (this.config.verbose) {
        console.log('Building target...');
      }

      this.process = spawn(this.config.command);

      this.process.on('close', code => {
        reject(new Error(`Could not build Target: ${code}`));
      });

      if (this.config.verbose) {
        this.process.stdout.pipe(process.stdout);
        this.process.stderr.pipe(process.stderr);
      }

      const interval = setInterval(() => {
        this.check()
          .then(() => {
            if (this.config.verbose) {
              console.log('Target is ready');
            }
            clearInterval(interval);
            resolve();
          })
          .catch(() => {
            if (this.config.verbose) {
              console.log(`Target not ready yet, retry in ${this.config.checkInterval}ms`);
            }
          });
      }, this.config.checkInterval);
    });
  }
}
