import _ from 'lodash';
import commandLineArgs from 'command-line-args';

const cli = commandLineArgs([
  { name: 'help', alias: 'h' },

  /*
   * API
   */
  { name: 'api-verbose', type: Boolean },
  { name: 'api-port', type: Number },
  { name: 'api-dir', type: String },

  /*
   * Target
   */
  { name: 'target-verbose', type: Boolean },
  { name: 'target-command', type: String },
  { name: 'target-url', type: String },
  { name: 'target-interval', type: Number },

  /*
   * Browser
   */
  { name: 'browser-verbose', type: Boolean },
  { name: 'browser-url', type: String },
  { name: 'browser-jQuery', type: Boolean },

  /*
   * Tests
   */
  { name: 'tests-verbose', type: Boolean },
  { name: 'tests-glob', type: String },

  { name: 'tests-mocha-grep', type: String },
  { name: 'tests-mocha-ui', type: String },
  { name: 'tests-mocha-reporter', type: String },
  { name: 'tests-mocha-timeout', type: Number },
]);

export function parseConfigFor(name, config) {
  if (process.env.NODE_ENV == 'green-light') {
    // Skip these if we're running
    // in our own test-suite
    return config;
  }

  const parsed = cli.parse();

  if (parsed.help) {
    console.log(cli.getUsage());
    process.exit(0);
  }

  const cliConf = _.reduce(parsed, (result, value, key) => {
    // Nested object for tests-mocha
    if (_.startsWith(key, 'tests-mocha')) {
      result.mocha = result.mocha || {};
      result.mocha[key.replace('tests-mocha-', '')] = value;
      return result;
    }

    // Regular options
    if (_.startsWith(key, name)) {
      result[key.replace(`${name}-`, '')] = value;
      return result;
    }

    // Nothing happened, continue anyway
    return result;
  }, {});

  return _.extend({}, config, cliConf);
}
