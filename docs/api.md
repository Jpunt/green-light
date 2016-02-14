# API
A mocked version of your API, to control what data is returned for certain URL's and usecases. Based on [mocked-api](https://www.npmjs.com/package/mocked-api).

## Configuration
To setup an API for GreenLight, add a `runAPI()` to your runner. Pass it an object as configuration, like so:

```js
var GreenLight = require('green-light');

GreenLight
  .init()
  .then(() => {
    return GreenLight.runAPI({
      port: 4000, // or whatever port is available to use
      dir: './test/mocks' // or wherever your mock-files are
    });
  });
```

Option | Type | Description
------ | ---- | -----------
`verbose` | `Boolean` | Enables extensive logging
`port` | `Integer` | The port that the API will run on
`dir` | `String` | The directory where your mocked data lives

## Usage
In this case, the API will be running on `http://localhost:4000` and will be looking for content in the `./test/mocks` directory. Add a json-file in the configured directory and open `http://localhost:4000/example.json` to validate that this is working as expected.

You can use nested directories to simulate a path-hierarchy. For example, the file at `./test/mocks/content/article/42.json` will be served at `http://localhost:4000/content/article/42.json` for the configuration above.

The configured API will be exposed by GreenLight, to mutate responses from within your tests:

```js
import { api } from 'green-light';
```

For more information about using the API, please refer to the documentation of [mocked-api](https://www.npmjs.com/package/mocked-api).

## Multiple API's
[mocked-api](https://www.npmjs.com/package/mocked-api) also supports the use of "named API's". Configure them one by one, with an extra `name` property and a different port:

```js
var GreenLight = require('green-light');

GreenLight
  .init()
  .then(() => {
    return GreenLight.runAPI({
      name: 'content',
      port: 4000,
      dir: './test/mocks/content'
    });
  .then(() => {
    return GreenLight.runAPI({
      name: 'user',
      port: 4001,
      dir: './test/mocks/user'
    });
  });
```

GreenLight will expose `getByName()` from [mocked-api](https://www.npmjs.com/package/mocked-api) to reference each API from within your tests:

```js
import { API } from 'green-light';
      // ^^^ Watch the capitals here. We need the class, not the (default and unnamed) instance.
const content = API.getByName('content');
const userApi = API.getByName('user');
```

## Command line overrides
You can override configuration through the CLI:

Command | Description
------- | -------
`--api-verbose` | Enables extensive logging
`--api-port` | The port that the API will run on
`--api-dir` | The directory where your mocked data lives


[Read this](./command-line-overrides.md) for more information about command line overrides.
