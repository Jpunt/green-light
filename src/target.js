import fetch from 'node-fetch';
import { spawn } from 'child_process';

export default class Target {
  constructor(config) {
    this.config = config;
    this.process = null;
  }

  start() {
    return new Promise((resolve, reject) => {
      this.check()
        .then(() => {
          if (this.config.verbose) {
            console.log('Target already running');
          }
          resolve();
        })
        .catch(() => {
          if (this.config.verbose) {
            console.log('Building target...');
          }

          this.process = spawn(this.config.cmd);
          this.process.stdout.pipe(process.stdout);
          this.process.stderr.pipe(process.stderr);
          this.process.on('close', code => {
            reject(new Error(`Could not build Target: ${code}`));
          });

          const interval = setInterval(() => {
            this.check()
              .then(() => {
                if (this.config.verbose) {
                  console.log('Target is ready');
                }
                clearInterval(interval);
                setTimeout(resolve, 100);
              })
              .catch(() => {
                if (this.config.verbose) {
                  console.log('Target not ready yet, retry in 1s');
                }
              });
          }, this.config.interval);
        });
    });
  }

  stop() {
    if (this.process) {
      this.process.stdin.pause();
      this.process.kill('SIGINT');
    }
  }

  check() {
    if (this.config.verbose) {
      console.log(`Checking target at: ${this.config.url}`);
    }
    return fetch(this.config.url);
  }
}
