# Tests
The actual code you'll be writing to test your project. Based on [mocha](https://www.npmjs.com/package/mocha) and [chai](https://www.npmjs.com/package/chai).

## Configuration
To setup your tests for GreenLight, add a `runTests()` to your runner. Pass it an object as configuration, like so:

```js
var GreenLight = require('green-light');

GreenLight
  .init()
  .then(() => {
    return GreenLight.runTests({
      glob: 'test/tests/**/*.js',
      mocha: {
        reporter: 'list',
        timeout: 5000,
        ui: 'bdd',
      }
    });
  })
});
```

Option | Type | Description
------ | ---- | -----------
`verbose` | `Boolean` | Enables extensive logging
`glob` | `String` | Pattern to find your tests (`'./test/**/*.js'` by default)
`mocha` | `Object` | Configuration of Mocha itself (all options explained on [this page](https://github.com/mochajs/mocha/wiki/Using-mocha-programmatically) can be used here)

## Usage
Your tests can be written like you would in regular Mocha, so please refer to their [documentation](https://github.com/mochajs/mocha/wiki/Using-mocha-programmatically) for more info. `expect` from [chai](https://www.npmjs.com/package/chai) will be exposed by GreenLight:

```js
import { expect } from 'green-light';

describe('testing', () => {
  it('works with mocha and chai', (done) => {
    expect(true).to.equal(true);
  });
})
```

## Command line overrides
You can override configuration through the CLI:

Command | Description
------- | -------
`--tests-verbose` | Enables extensive logging
`--tests-glob` | Pattern to find your tests
`--tests-mocha-grep` | The `grep` option for Mocha
`--tests-mocha-ui` | The `ui` option for Mocha
`--tests-mocha-reporter` | The `reporter` option for Mocha
`--tests-mocha-timeout` | The `timeout` option for Mocha

[Read this](./command-line-overrides.md) for more information about command line overrides.
