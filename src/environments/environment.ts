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
  enablePerformanceLogs: false,
  defaultCurrency: 'USD',
  bufferTime: 50,
  maxBufferSize: 10,
  disableBuffer: false,
  subqueryLimit: 10,
  disableCache: false,
  encryptResponse: false,
  cartRetryLimit: 20,
  productIdentifier: 'Id',
  type: 'Salesforce',
  debounceTime: 1000,
  proxy: 'https://apttus-proxy.herokuapp.com',
  sentryDsn: '***sentry.io url***',
  useIndexedDB: true,
 storefront: '*** Storefront Name ****',
 expandDepth: 8,

  // Salesforce environment variables
  organizationId: '****Salesforce Organization Id****',
  endpoint: '****Salesforce Community URL****'

};