# Command line overrides
Configuration can be bypassed through the CLI (where it makes sense). For example, if you want to enable extensive browser-logging for the next run:

```
node ./test/runner.js --browser-verbose
```

When you've got your runner-script setup as a npm-script, don't forget to give it an extra `--`. This will pass the arguments to the runner:

```
npm test -- --browser-verbose
```

## Commands

Command | Description
------- | -------
`--api-verbose` | Enables extensive logging
`--api-port` | Runs the API on a different port
`--api-dir` | Use a different directory
`--target-verbose` | Enables extensive logging
`--target-command` | The command to run your target
`--target-cwd` | The current working directory of the command
`--target-checkUrl` | The URL which will be polled to know it's ready
`--target-checkInterval` | The speed of polling in `ms`
`--target-checkTimeout` | The maximum amount of polling in `ms`
`--browser-verbose` | Enables extensive logging
`--browser-jQuery` | Injects `jQuery` into the browser
`--browser-baseUrl` | The URL to be used as the base for `go()` calls
`--browser-readyWhenInterval` | The speed of polling in `ms`
`--browser-readyWhenTimeout` | The maximum amount of polling in `ms`
`--tests-verbose` | Enables extensive logging
`--tests-glob` | Pattern to find your tests
`--tests-mocha-grep` | The `grep` option for Mocha
`--tests-mocha-ui` | The `ui` option for Mocha
`--tests-mocha-reporter` | The `reporter` option for Mocha
`--tests-mocha-timeout` | The `timeout` option for Mocha
