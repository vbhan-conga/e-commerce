import { Configuration } from '@apttus/core';
export const environment: Configuration = {
  production: false,
  defaultImageSrc: './assets/images/default.png',
  defaultCountry: 'US',
  defaultLanguage: 'en-US',
  enableErrorLogging: false,
  enableErrorReporting: false,
  enableMultiCurrency: false,
  enableQueryLogs: true,
  enablePerformanceLogs: true,
  defaultCurrency: 'USD',
  bufferTime: 20,
  maxBufferSize: 10,
  disableBuffer: false,
  subqueryLimit: 10,
  disableCache: false,
  encryptResponse: false,
  cartRetryLimit: 10,
  productIdentifier: 'Id',
  type: 'Salesforce',
  debounceTime: 1000,
  proxy: 'https://apttus-proxy.herokuapp.com',
  useIndexedDB: false,
  expandDepth: 7,
  hashRouting: false,
  packageNamespace: 'Apttus_WebStore',
  // *** TODO: Replace with Salesforce environment variables ***
  storefront: 'D-Commerce',
  organizationId: '00D7A0000009Tnl',
  sentryDsn: 'https://6ad10246235742dc89f89b4c3f53f4aa@sentry.io/1230495',
  endpoint: 'https://dc6-cpqqacommunity1.cs44.force.com/ecom'

};
