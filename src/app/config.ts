import { environment } from '../environments/environment';
import { Configuration } from '@apttus/core';

export const AppConfig: Configuration = {
    endpoint: 'https://sum17patch-qawinter18.cs8.force.com/dc',
    production: environment.production,
    organizationId: '00DL00000061f4D',
    defaultImageSrc: '/assets/images/default.png',
    defaultCountry: 'US',
    defaultLanguage: 'en-US',
    enableErrorLogging: false,
    enableErrorReporting: false,
    enableMultiCurrency: false,
    enableQueryLogs: true,
    enablePerformanceLogs: false,
    defaultCurrency: 'USD',
    bufferTime: 200,
    maxBufferSize: 10,
    disableBuffer: false,
    disableCache: false,
    encryptResponse: false,
    productIdentifier: 'ProductCode',
    type: 'Salesforce'
};