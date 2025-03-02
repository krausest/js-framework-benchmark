const ENV = {
  modulePrefix: 'results',
  environment: import.meta.env.DEV ? 'development' : 'production',
  rootURL: import.meta.env.VITE_NO_JSBF ? '/' : '/frameworks/keyed/ember/',
  locationType: 'history',
  APP: {},
};

export default ENV;
