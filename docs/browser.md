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
      baseUrl: 'http://localhost:8000' // or wherever your project is running
    });
  })
});
```

Option | Type | Description
------ | ---- | -----------
`verbose` | `Boolean` | Enables extensive logging
`baseUrl` | `String` | The URL to be used as the base for `go()` calls. This usually is the domain where your target is running
`jQuery` | `Boolean` | Injects `jQuery` into the browser
`setupWindow` | `Function` | Add extra helper-methods for your tests here, or wait for the client to be initialized (always return a resolved promise here!)

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

## Command line overrides
You can override configuration through the CLI:

Command | Description
------- | -------
`--browser-verbose` | Enables extensive logging
`--browser-jQuery` | Injects `jQuery` into the browser
`--browser-baseUrl` | The URL to be used as the base for `go()` calls

[Read this](./command-line-overrides.md) for more information about command line overrides.
