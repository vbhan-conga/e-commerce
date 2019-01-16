import { Configuration } from '@apttus/core';


export const environment: Configuration = {
  production: true,
  defaultImageSrc: '/assets/images/default.png',
  defaultCountry: 'US',
  defaultLanguage: 'en-US',
  enableErrorLogging: false,
  enableErrorReporting: false,
  enableMultiCurrency: false,
  enableQueryLogs: false,
  enablePerformanceLogs: false,
  defaultCurrency: 'USD',
  bufferTime: 200,
  maxBufferSize: 10,
  disableBuffer: false,
  subqueryLimit: 10,
  disableCache: false,
  encryptResponse: false,
  cartRetryLimit: 20,
  productIdentifier: 'Id',
  cartDebounceTime: 2000,

  /**
   * AIC Environment Example
   * Uncomment this for AIC environment
   * NOTE: This configuration uses a proxy hosted at apttus-proxy.herokuapp.com. This proxy is not intended for production use.
   */
  // type: 'AIC',
  // endpoint: 'https://apttus-proxy.herokuapp.com/https://example.apttuscloud.io',
  // authenticationEndpoint: 'https://apttus-proxy.herokuapp.com/https://login.microsoftonline.com',
  // tenant: 'example.apttuscloud.io',
  // tenantId: 111111,
  // storageAccount: 'exampletenant',
  // clientId: '000000-000-000-000000',
  // clientSecret: 'base64encodedclientsecret='



  /**
   * SFDC Example File
   * Uncomment this for SFDC Environment
   * NOTE: This configuration uses a proxy hosted at apttus-proxy.herokuapp.com. This proxy is not intended for production use.
   */
  // type: 'Salesforce',
  // endpoint: 'https://apttus-proxy.herokuapp.com/https://my-domain.apttuscommunities.com',
  // organizationId: '00100000ab01'
};