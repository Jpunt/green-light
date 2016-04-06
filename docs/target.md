# Target
The project you'd like to test, connected to the mocked API.

## Configuration
To setup a target for GreenLight, add a `runTarget()` to your runner. Pass it an object as configuration, like so:

```js
var GreenLight = require('green-light');

GreenLight
  .init()
  .then(() => {
    return GreenLight.runTarget({
      command: 'npm start --config=test', // or whatever command you'll run to start your project
      checkUrl: 'http://localhost:8000', // or whatever page is available as soon as your project is ready
    });
  })
});
```

Option | Type | Description
------ | ---- | -----------
`verbose` | `Boolean` | Enables extensive logging
`command` | `String` | The command to run your target (make sure it's connected to the mocked API, instead of the regular data-source)
`cwd` | `String` | The current working directory of the command (only if you need it, because you can't do something like `cd app/whatever/path && npm start`)
`checkUrl` | `String` | The URL which will be polled to know it's ready (usually the homepage or a status-page of some sorts)
`checkInterval` | `Integer` | The speed of polling in `ms` (default: `1000`)
`checkTimeout` | `Integer` | The maximum amount of polling in `ms` (default: `300000` / 5 minutes)

## Command line overrides
You can override configuration through the CLI:

Command | Description
------- | -------
`--target-verbose` | Enables extensive logging
`--target-command` | The command to run your target
`--target-cwd` | The current working directory of the command
`--target-checkUrl` | The URL which will be polled to know it's ready
`--target-checkInterval` | The speed of polling in `ms`
`--target-checkTimeout` | The maximum amount of polling in `ms`

[Read this](./command-line-overrides.md) for more information about command line overrides.
