# Getting started

## Initial setup
To create an initial setup, run the following commands:

```
npm install green-light --save-dev
mkdir -p test/{mocks,tests}
touch test/runner.js
touch test/tests/hello-world.js
touch test/mocks/hello-world.json
```

Use Node to run GreenLight:

```
node test/runner.js
```

Or add the following to your `package.json` and run `npm test`:

```json
"scripts": {
  "test": "node test/runner.js"
}
```

At this point, this doesn't do anything. That's because `runner.js` doesn't have anything in it. Let's do that:

```js
var GreenLight = require('green-light');

GreenLight
  .init()
  .then(function(exitCode) {
    GreenLight.done(exitCode);
  })
  .catch(function(err) {
    GreenLight.fail(err);
  });
```

To make things easier later on, I'd recommend installing [Babel](https://babeljs.io) for fancy ES6-support:

```
npm install --save-dev babel-core babel-preset-es2015 babel-register
echo '{ "presets": ["es2015"] }' > .babelrc
```

and add the require hook to `test/runner.js`:

```js
require('babel-register');
const GreenLight = require('green-light');

GreenLight
  .init()
  .then(exitCode => GreenLight.done(exitCode))
  .catch(err => GreenLight.fail(err));
```

> Watch out: `require('babel-register')` makes it possible to do new stuff in nested files, but not in `runner.js` itself. While newer versions of Node support things like fat arrows, you have to `require` `GreenLight` here the old way :(

Well... `npm test` still doesn't do a lot, but we'll get to that. Let's start with the API.

## API
To setup the mocked API, add some content to `test/mocks/hello-world.json`:

```json
{
  "title": "Hey there!"
}
```

and add the following to `test/runner.js`:

```js
GreenLight
  .init()
  .then(() => {
    return GreenLight.runAPI({
      verbose: true,
      port: 4000, // or whatever port is available to use
      dir: './test/mocks' // or wherever your mock-files are
    });
  })
  .then(() => {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 100000);
    });
  })
  .then(exitCode => GreenLight.done(exitCode))
  .catch(err => GreenLight.fail(err));
```

That extra promise and timeout are there to check out what's going on. Run `npm test` and open `http://localhost:4000/hello-world.json` to see if this works as expected.

## Target
The target is your app we want to test. It can be anything, as long as it can be started with a command on your CLI, and it can be configured to connect to the mocked API instead of its regular source. Add `runTarget()` to `test/runner.js`:

```js
GreenLight
  .init()
  .then(() => {
    return GreenLight.runAPI({
      verbose: true,
      port: 4000,
      dir: './test/mocks'
    });
  })
  .then(() => {
    return GreenLight.runTarget({
      verbose: true,
      command: 'npm start --config=test', // or whatever command you'll run to start your project
      checkUrl: 'http://localhost:8000', // or whatever page is available as soon as your project is ready
    });
  })
  .then(() => {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 100000);
    });
  })
  .then(exitCode => GreenLight.done(exitCode))
  .catch(err => GreenLight.fail(err));
```

After starting the API, your project will start running (and it will be checked periodically to see if it's ready to test).

## Browser
The browser will visit your target and can be configured like so:

```js
GreenLight
  .init()
  .then(() => {
    return GreenLight.runAPI({
      verbose: true,
      port: 4000,
      dir: './test/mocks'
    });
  })
  .then(() => {
    return GreenLight.runTarget({
      verbose: true,
      command: 'npm start --config=test',
      checkUrl: 'http://localhost:8000',
    });
  })
  .then(() => {
    return GreenLight.runBrowser({
      verbose: true,
      baseUrl: 'http://localhost:8000', // Or wherever your project is running
      jQuery: true,
    });
  })
  .then(() => {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 100000);
    });
  })
  .then(exitCode => GreenLight.done(exitCode))
  .catch(err => GreenLight.fail(err));
```

## Tests
Are you ready for this? Let's write an actual test in `test/tests/hello-world.js`:

```js
import { api, browser, expect } from 'green-light';

describe('Article', () => {
  describe('when it has a title', () => {
    it('renders the title', (done) => {
      api
        .respondTo('/hello-world.json')
        .andReplace('/title', 'Test title');

      browser
        .go('/hello-world')
        .then(window => {
          expect(window.$('h1').text()).to.equal('Test title');
        })
        .then(done, done);
    });
  });

  describe('when it does not have a title', () => {
    it('renders no title', (done) => {
      api
        .respondTo('/hello-world.json')
        .andReplace('/title', null);

      browser
        .go('/hello-world')
        .then(window => {
          expect(window.$('h1').length).to.equal(0);
        })
        .then(done, done);
    });
  });
});
```

Now we can remove that debugging and configure the last step in `test/runner.js`:

```js
GreenLight
  .init()
  .then(() => {
    return GreenLight.runAPI({
      port: 4000,
      dir: './test/mocks'
    });
  })
  .then(() => {
    return GreenLight.runTarget({
      command: 'npm start --config=test',
      checkUrl: 'http://localhost:8000',
    });
  })
  .then(() => {
    return GreenLight.runBrowser({
      baseUrl: 'http://localhost:8000',
      jQuery: true,
    });
  })
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
  .then(exitCode => GreenLight.done(exitCode))
  .catch(err => GreenLight.fail(err));
```

# Congratulations
You should be good to go. For more advanced options, take a look at:

- [API](api.md)
- [Target](target.md)
- [Browser](browser.md)
- [Tests](tests.md)
