# GreenLight
There are a lot of ways you can test your project. You can go with unit-testing, integration-testing, end-to-end-testing, or by manually clicking around your site to see everything still works.

My personal favorite is **functional testing**. Write tests for each functionality of your project, simulate different circumstances which this specific part can run in and make sure everything is still O.K. An example would be:

```js
import { api, browser, expect } from 'green-light';

describe('article title', () => {
  describe('when it has a title', () => {
    it('renders the title', (done) => {
      api
        .respondTo('/article/42.json')
        .andReplace('/title', 'Some title');

      browser
        .go('/article/42')
        .then((window) => {
          expect(window.$('h1').text()).to.equal('Some title');
        })
        .then(done, done);
    });
  });

  describe('when it has no title', () => {
    it('renders no title', (done) => {
      api
        .respondTo('/article/42.json')
        .andReplace('/title', null);

      browser
        .go('/article/42')
        .then((window) => {
          expect(window.$('h1').length).to.equal(0);
        })
        .then(done, done);
    });
  });
})
```

GreenLight bundles all the tools you'll need to do exactly this.  It can be configured and runned with node.

## Getting started
Check out an example of a setup [over here](#), follow the steps in the [getting started guide](docs/getting-started.md), or take a look at the documentation for each part of GreenLight for more details:

### API
A mocked version of your API, to control what data is returned for certain URL's and usecases. Based on [mocked-api](https://www.npmjs.com/package/mocked-api).

[Read more](docs/api.md).

### Target
The project you'd like to test, connected to the mocked API.

[Read more](docs/target.md).

### Browser
A virtual browser that visits the page that you're testing. Based on [jsdom](https://www.npmjs.com/package/jsdom).

[Read more](docs/browser.md).

### Tests
The actual code you'll be writing to test your project. Based on [mocha](https://www.npmjs.com/package/mocha) and [chai](https://www.npmjs.com/package/chai).

[Read more](docs/target.md).

## Don't use this if 
- You can't run node.
- You want to use Jasmine, Karma, CasperJS, RSpec, PhantomJS, Nightwatch, NodeUnit, Sinon, Cucumber, ZombieJS, Selenium, JUnit, etc. GreenLight works with Mocha, JSDom and MockedApi. These tools are great and support for anything else is not worth the complexity. 
- You don't want to write functional tests. Unit-tests, for example, are awesome in some cases, but you don't need GreenLight for that. If you want to do something else than functional testing, I'd suggest to use plain Mocha instead. This doesn't mean that you can't combine different kinds of testing though! It's not weird to do both unit-testing and functional-testing for the same app.
- Your project doesn't get its data from an API that you can mock. A large part of functional testing is to simulate different kinds of data and test how your app is responding to that. If you can't do that, GreenLight is probably not a greath fit and you should go with a different kind of setup.

## Use this if
- You can run node. This doesn't mean that your project has to be written in node though. In fact, your project can be written in any language, as long as GreenLight can run it with some kind of command. Node is only needed for running the test-suite, mocked API and the virtual browser. 
- Your project gets its data from an API and you can configure it to a mocked version of that.
- You're ok with Mocha, JSDom and MockedApi.








