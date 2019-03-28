import { Configuration } from '@apttus/core';
export const environment: Configuration = {
  production: true,
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
  cartDebounceTime: 2000,
  proxy: 'https://apttus-proxy.herokuapp.com',

  // Salesforce environment variables
  organizationId: '****Salesforce Organization Id****',
  endpoint: '****Salesforce Community URL****'
};