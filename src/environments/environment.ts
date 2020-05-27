import { Configuration } from '@apttus/core';
export const environment: Configuration = {
  production: false,
  defaultImageSrc: 'https://loremflickr.com/320/240/hardware,computer,server/all',
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
  useIndexedDB: false,
  expandDepth: 7,
  hashRouting: false,
    // *** TODO: Replace with Salesforce environment variables ***
  storefront: 'ECommerce',
  endpoint: '	https://apttusdc-developer-edition.na134.force.com/ecommerce'
};
