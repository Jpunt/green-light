import fetch from 'node-fetch';
import { spawn } from 'child_process';
import poll from 'promise-poller';

export default class Target {
  constructor(config) {
    this.process = null;

    this.config = {
      verbose: config.verbose,
      command: config.command,
      cwd: config.cwd,
      checkUrl: config.checkUrl,
      checkInterval: config.checkInterval || 1000,
      checkTimeout: config.checkTimeout || (1000 * 60 * 5),
    };

    if (!this.config.command) {
      throw new Error('No command or file set to run target');
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

  startProcess() {
    const splitted = this.config.command.split(' ');
    const command = splitted[0];
    const args = splitted.slice(1);
    const options = {
      cwd: this.config.cwd,
    };
    this.process = spawn(command, args, options);
  }

  buildTarget() {
    return new Promise((resolve, reject) => {
      if (this.config.verbose) {
        console.log('Building target...');
      }

      this.startProcess();

      this.process.on('close', code => {
        reject(new Error(`Could not build Target: ${code}`));
      });

      if (this.config.verbose) {
        this.process.stdout.pipe(process.stdout);
        this.process.stderr.pipe(process.stderr);
      }

      poll({
        taskFn: () => this.check(),
        interval: this.config.checkInterval,
        timeout: this.config.checkTimeout,
      }).then(resolve, reject);
    });
  }
}
