import MockedApi from 'mocked-api';

module.exports = {
  api: null,
  API: MockedApi,
  initAPI: function(config) {
    return new Promise((resolve, reject) => {
      const api = MockedApi.setup(config);
      api.start(() => {
        if (!config.name) {
          this.api = api;
        }
        resolve();
      });
    });
  },
};
