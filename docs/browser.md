# Browser
A virtual browser that visits the page that you're testing. Based on [jsdom](https://www.npmjs.com/package/jsdom).

## Configuration
To setup a browser for GreenLight, add a `runBrowser()` to your runner. Pass it an object as configuration, like so:

```js
var GreenLight = require('green-light');

GreenLight
  .init()
  .then(() => {
    return GreenLight.runBrowser({
      baseUrl: 'http://localhost:8000' // or wherever your target is running
    });
  })
});
```

Option | Type | Description
------ | ---- | -----------
`verbose` | `Boolean` | Enables extensive logging
`baseUrl` | `String` | The URL to be used as the base for `go()` calls. This usually is the domain where your target is running
`jQuery` | `Boolean` | Injects `jQuery` into the browser
`setupWindow` | `Function` | Add extra helper-methods for your tests here.
`readyWhen` | `Function` | Whether or not `window` is ready to be tested.
`readyWhenInterval` | `Integer` | The speed of polling in `ms` (default: `10`)
`readyWhenTimeout` | `Integer` | The maximum amount of polling in `ms` (default: `2000`)

## Usage
The configured browser will be exposed by GreenLight:

```js
import { browser } from 'green-light';
```

To visit a page from within your tests, you can use `go(path)`:

```js
browser
  .go('/article/42');
  .then(window => {
    // This is only called when the page is loaded successfully
    // and window.$ will be available if you enabled `jQuery`
    // in your configuration
  })
  .catch(err => {
    // This will be called when something went wrong
  });
```

## readyWhen
When the client needs more time to be ready, you can use `readyWhen`:

```js
GreenLight
  .init()
  .then(() => {
    return GreenLight.runBrowser({
      baseUrl: 'http://localhost:8000',
      readyWhen: (window) => {
        return document.body.classList.contains('initialized');
        // ...or whatever your client does when it's ready, it may also be something like:
        // return window.isInitialized === true;
      }
    });
  })
});
```

The `readyWhen` function will be called every couple of ms (configurable with `readyWhenInterval`) and it will time out when it takes too long (configurable with `readyWhenTimeout`). When you don't configure `readyWhen`, the client is considered ready immediately.

## Command line overrides
You can override configuration through the CLI:

Command | Description
------- | -------
`--browser-verbose` | Enables extensive logging
`--browser-jQuery` | Injects `jQuery` into the browser
`--browser-baseUrl` | The URL to be used as the base for `go()` calls
`--browser-readyWhenInterval` | The speed of polling in `ms`
`--browser-readyWhenTimeout` | The maximum amount of polling in `ms`

[Read this](./command-line-overrides.md) for more information about command line overrides.
